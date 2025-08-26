const {
    PAGE_SIZE,
    AWS_S3_HOST_NAME,
    STORAGE_DIR,
} = require("../../configs/env");
const { resolve } = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const db = require("../../db");
const {
    AsyncCatch,
    pagination,
    validator,
    uploadErrHandler,
    handleFilePath,
    listImageChapter,
    sanitizeHtml,
} = require("../../helpers/utilities");

const {
    getOrigin,
    getAuthor,
    getCouple,
    getTag,
    getTeam,
    listChapter,
} = require("../../class/manga");
const mangaValidator = require("../../validators/manga.validator");
const multer = require("multer");
const { BadRequest, NotFound } = require("../../helpers/response");
const { compress, purgeCloudFlare } = require("../../helpers/process");
const config = require("../../configs/env");
const Notification = require("../../class/notification");

const listManga = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    //logic
    const teamID = req.userData.teamID;
    const result = await db.queryPlaceholdersAsync(
        "SELECT * FROM manga WHERE id IN (SELECT mangaID FROM manga_team WHERE teamID = ?) ORDER BY lastUpdate DESC LIMIT ?, ?",
        [teamID, SKIP, PAGE_SIZE]
    );

    // count rows
    const resultCount = await db.queryPlaceholdersAsync(
        "SELECT COUNT(1) AS resultCount FROM manga WHERE id IN (SELECT mangaID FROM manga_team WHERE teamID = ?)",
        [teamID]
    );

    // send result
    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;
    res.send(data);
});

const minInfoManga = AsyncCatch(async (req, res, next) => {
    const { id } = validator(mangaValidator(["id"]), req.params);
    const manga = await db.queryPlaceholdersAsync(
        "SELECT id, originalName, otherName, thumbnail, type, status, description FROM manga WHERE id = ?",
        [id]
    );
    if (!manga || manga.length == 0)
        throw new NotFound("Không tìm thấy truyện!");
    const result = manga[0];
    if (result.type === 1) {
        result.origin = [];
        result.couple = [];
    } else {
        result.origin = await getOrigin(id);
        result.couple = await getCouple(id);
    }
    result.author = await getAuthor(id);
    result.team = await getTeam(id);
    result.tag = await getTag(id);

    res.send(result);
});

const chapterList = AsyncCatch(async (req, res, next) => {
    const { id } = validator(mangaValidator(["id"]), req.params);
    const result = await db.queryPlaceholdersAsync(
        "SELECT id, name, mangaID, maxID FROM chapter WHERE mangaID = ?",
        [id]
    );

    result.sort((b, a) => {
        return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
        });
    });

    await Promise.all(
        result.map(async (e) => {
            e.url = listImageChapter(e.mangaID, e.id, e.maxID);
        })
    );

    res.send(result);
});
const addManga = AsyncCatch(async (req, res, next) => {
    try {
        if (!req.file) return next(new BadRequest("Thumbnail required!"));
        let body = {};
        Object.keys(req.body).forEach((key) => {
            body[key] = JSON.parse(req.body[key]);
        });
        const { originalName, otherName, description, type } = validator(
            mangaValidator([
                "originalName",
                "otherName",
                "description",
                "type",
            ]),
            body
        );

        let { tag, author, couple, origin } = body;

        const insertMangaOperator = await db.queryPlaceholdersAsync(
            "INSERT INTO manga (originalName, otherName, description, type) VALUES (?, ?, ?, ?)",
            [sanitizeHtml(originalName), otherName, description, type]
        );
        const mangaID = insertMangaOperator.insertId;
        const dir = resolve(`${STORAGE_DIR}/manga/${mangaID}`);

        fs.ensureDirSync(dir);
        const realPath = `${dir}/thumbnail.jpeg`;
        const path = `manga/${mangaID}/thumbnail.jpeg`;

        compress(req.file.buffer, realPath, { width: 350, height: null }).catch(
            async (err) => {
                fs.rm(dir, {
                    force: true,
                    recursive: true,
                });
                await db.queryPlaceholdersAsync(
                    "DELETE FROM manga WHERE id = ?",
                    [mangaID]
                );
                next(err);
            }
        );

        await db.queryPlaceholdersAsync(
            "UPDATE manga SET thumbnail = ? WHERE id = ?",
            [path, mangaID]
        );
        await db.queryPlaceholdersAsync(
            "INSERT INTO manga_team (mangaID, teamID) VALUES(?, ?)",
            [mangaID, req.userData.teamID]
        );

        if (tag.length != 0) {
            await Promise.all(
                tag.map(async (id) => {
                    await db.queryPlaceholdersAsync(
                        "INSERT INTO manga_tag (mangaID, tagID) VALUES(?, ?)",
                        [mangaID, id]
                    );
                })
            );
        }

        if (type === 2 && couple.length != 0) {
            await Promise.all(
                couple.map(async (id) => {
                    await db.queryPlaceholdersAsync(
                        "INSERT INTO manga_couple (mangaID, coupleID) VALUES(?, ?)",
                        [mangaID, id]
                    );
                })
            );
        }

        if (author.length != 0) {
            await Promise.all(
                author.map(async (id) => {
                    await db.queryPlaceholdersAsync(
                        "INSERT INTO manga_author (mangaID, authorID) VALUES(?, ?)",
                        [mangaID, id]
                    );
                })
            );
        }

        if (type === 2 && origin.length != 0) {
            await Promise.all(
                origin.map(async (id) => {
                    await db.queryPlaceholdersAsync(
                        "INSERT INTO manga_origin (mangaID, originID) VALUES(?, ?)",
                        [mangaID, id]
                    );
                })
            );
        }

        res.send("Success!");
        const team = await db.queryPlaceholdersAsync(
            "SELECT name FROM team WHERE id = ?",
            [req.userData.teamID]
        );

        const n = new Notification({
            type: "TEAM_FOLLOWING_MANGA_PUBLISH",
            title: `<strong>${team[0].name} - ${originalName}</strong>`,
            body: "Nhóm dịch bạn đang theo dõi vừa đăng truyện mới! Xem ngay!",
            url: `https://yurineko.moe/manga/${mangaID}`,
            objectId: mangaID,
            thumbnail: path,
            icon: "follow-new-manga",
        });

        await n.save();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

const editManga = AsyncCatch(async (req, res, next) => {
    let body = {};
    Object.keys(req.body).forEach((key) => {
        body[key] = JSON.parse(req.body[key]);
    });

    const { id } = validator(mangaValidator(["id"]), req.params);
    const mangaID = id;
    const { originalName, otherName, description, type } = validator(
        mangaValidator(["originalName", "otherName", "description", "type"]),
        body
    );

    const { tag, author, couple, origin } = body;

    const manga = await db.queryPlaceholdersAsync(
        "SELECT thumbnail FROM manga WHERE id = ? LIMIT 1",
        [id]
    );
    if (manga.length === 0)
        return next(new BadRequest("Không tồn tại truyện!"));

    const checkTeam = await db.queryPlaceholdersAsync(
        "SELECT teamID FROM manga_team WHERE mangaID = ?",
        [id]
    );

    // admin vẫn sửa được (role = 3)
    if (req.userData.role == 2 && req.userData.teamID != checkTeam[0].teamID)
        return next(new BadRequest("Bạn không có quyền chỉnh sửa truyện này"));

    if (type == 1 && origin && origin.length > 0)
        return next(new BadRequest("Truyện thường không thể có truyện gốc!"));

    await db.queryPlaceholdersAsync(
        "UPDATE manga SET originalName = ?, otherName = ?, description = ?, type = ? WHERE id = ?",
        [sanitizeHtml(originalName), otherName, description, type, id]
    );

    if (req.file) {
        const oldPath = `${STORAGE_DIR}/${manga[0].thumbnail}`;
        const path = `manga/${mangaID}/${uuidv4()}.jpeg`;
        const newPath = `${STORAGE_DIR}/${path}`;
        compress(req.file.buffer, newPath).catch(async (err) => next(err));
        await db.queryPlaceholdersAsync(
            "UPDATE manga SET thumbnail = ? WHERE id = ?",
            [path, mangaID]
        );
        fs.rmSync(oldPath);
    }
    await db.queryPlaceholdersAsync("DELETE FROM manga_tag WHERE mangaID = ?", [
        id,
    ]);
    await db.queryPlaceholdersAsync(
        "DELETE FROM manga_couple WHERE mangaID = ?",
        [id]
    );
    await db.queryPlaceholdersAsync(
        "DELETE FROM manga_author WHERE mangaID = ?",
        [id]
    );
    await db.queryPlaceholdersAsync(
        "DELETE FROM manga_origin WHERE mangaID = ?",
        [id]
    );

    if (tag) {
        await Promise.all(
            tag.map(async (id) => {
                await db.queryPlaceholdersAsync(
                    "INSERT INTO manga_tag (mangaID, tagID) VALUES(?, ?)",
                    [mangaID, id]
                );
            })
        );
    }

    if (couple) {
        await Promise.all(
            couple.map(async (id) => {
                await db.queryPlaceholdersAsync(
                    "INSERT INTO manga_couple (mangaID, coupleID) VALUES(?, ?)",
                    [mangaID, id]
                );
            })
        );
    }

    if (author) {
        await Promise.all(
            author.map(async (id) => {
                await db.queryPlaceholdersAsync(
                    "INSERT INTO manga_author (mangaID, authorID) VALUES(?, ?)",
                    [mangaID, id]
                );
            })
        );
    }

    if (type == 2 && origin) {
        await Promise.all(
            origin.map(async (id) => {
                await db.queryPlaceholdersAsync(
                    "INSERT INTO manga_origin (mangaID, originID) VALUES(?, ?)",
                    [mangaID, id]
                );
            })
        );
    }
    res.send("Success!");
});

const deleteManga = AsyncCatch(async (req, res, next) => {
    const { id } = validator(mangaValidator(["id"]), req.params);
    const existManga = await db.queryPlaceholdersAsync(
        "SELECT EXISTS (SELECT 1 FROM manga WHERE id = ?) AS exist",
        [id]
    );
    if (existManga[0].exist === 0)
        throw new BadRequest("Không tồn tại truyện!");

    const checkTeam = await db.queryPlaceholdersAsync(
        "SELECT teamID FROM manga_team WHERE mangaID = ?",
        [id]
    );
    if (req.userData.role === 2 && req.userData.teamID !== checkTeam[0].teamID)
        return next(new BadRequest("Bạn không có quyền chỉnh sửa truyện này"));

    const dir = resolve(`${__dirname}/../../../test/manga/${id}`);
    fs.rmSync(dir, {
        force: true,
        recursive: true,
    });

    await db.queryPlaceholdersAsync("DELETE FROM manga WHERE id = ?", [id]);

    res.send("Success!");
});

const editStatus = AsyncCatch(async (req, res, next) => {
    const { id } = validator(mangaValidator(["id"]), req.params);
    const { status } = req.body;
    console.log(status);
    const existManga = await db.queryPlaceholdersAsync(
        "SELECT EXISTS (SELECT 1 FROM manga WHERE id = ?) AS exist",
        [id]
    );
    if (existManga[0].exist === 0)
        throw new BadRequest("Không tồn tại truyện!");

    const checkTeam = await db.queryPlaceholdersAsync(
        "SELECT teamID FROM manga_team WHERE mangaID = ?",
        [id]
    );
    if (req.userData.role === 2 && req.userData.teamID !== checkTeam[0].teamID)
        return next(new BadRequest("Bạn không có quyền chỉnh sửa truyện này"));

    await db.queryPlaceholdersAsync(
        "UPDATE manga SET status = ? WHERE (id = ?)",
        [status, id]
    );

    res.send("Success!");
});

const search = AsyncCatch(async (req, res, next) => {
    const query = "%".concat(req.query.query.concat("%")) ?? "";
    const flag = req.userData.role == 3 ? true : false;
    const teamID = req.userData.teamID;

    const result = await db.queryPlaceholdersAsync(
        "SELECT m.* FROM manga m, manga_team mt WHERE (m.originalName LIKE ? OR m.otherName LIKE ?) AND (? OR mt.teamID = ?) AND mt.mangaID = m.id LIMIT ?",
        [query, query, flag, teamID, PAGE_SIZE]
    );

    await Promise.all(
        result.map(async (e) => {
            const id = e.id;
            const team = await db.queryPlaceholdersAsync(
                "SELECT * FROM team WHERE id IN (SELECT teamID FROM manga_team WHERE mangaID = ?)",
                [id]
            );
            e.team = team[0];
        })
    );

    res.send(result);
});

module.exports = {
    list: listManga,
    chapterList,
    info: minInfoManga,
    add: addManga,
    edit: editManga,
    delete: deleteManga,
    editStatus,
    find: search,
};
