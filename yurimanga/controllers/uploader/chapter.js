const {
    AsyncCatch,
    uploadErrHandler,
    validator,
    sanitizeHtml,
} = require("../../helpers/utilities");
const multer = require("multer");
const { BadRequest, InternalServerError } = require("../../helpers/response");
const chapterValidator = require("../../validators/chapter.validator");
const fs = require("fs-extra");
const { resolve } = require("path");
const db = require("../../db");
const { purgeCloudFlare, compress } = require("../../helpers/process");
const { AWS_S3_HOST_NAME, STORAGE_DIR } = require("../../configs/env");
const Notification = require("../../class/notification");

const addChapter = AsyncCatch(async (req, res, next) => {
    if (!req.files) return next(new BadRequest("Thiếu ảnh chapter!"));
    const { name, mangaID } = validator(
        chapterValidator(["name", "mangaID"]),
        req.body
    );

    const op = await db.queryPlaceholdersAsync(
        "INSERT INTO chapter (name, mangaID) VALUES(?, ?)",
        [sanitizeHtml(name), mangaID]
    );

    const chapterID = op.insertId;

    req.files.sort((a, b) =>
        a.originalname
            .split(".")[0]
            .localeCompare(b.originalname.split("."), undefined, {
                numeric: true,
                sensitivity: "base",
            })
    );

    const dir = resolve(
        `${STORAGE_DIR}/manga/${mangaID}/chapters/${chapterID}`
    );
    fs.ensureDirSync(dir);
    let iterator = 0;
    await Promise.all(
        req.files.map(async (e) => {
            ++iterator;
            const realPath = `${dir}/${iterator}.jpeg`;
            await compress(e.buffer, realPath).catch(async (err) => {
                await db.queryPlaceholdersAsync(
                    "DELETE FROM chapter WHERE id = ?",
                    [chapterID]
                );
                return next(new InternalServerError("Có lỗi xảy ra!"));
            });
        })
    );

    await db.queryPlaceholdersAsync(
        "UPDATE manga SET lastUpdate = CURRENT_TIMESTAMP(), totalChapter = totalChapter + 1 WHERE id = ?",
        [mangaID]
    );
    await db.queryPlaceholdersAsync(
        "UPDATE chapter SET maxID = ? WHERE id = ?",
        [iterator, chapterID]
    );

    res.send("Success!");

    // gửi request cho uploader xong mới tính chuyện gửi notification
    const manga = await db.queryPlaceholdersAsync(
        "SELECT originalName, thumbnail FROM manga WHERE id = ? LIMIT 1",
        [mangaID]
    );

    var n = new Notification({
        type: "MANGA_FOLLOWING_NEW_CHAPTER",
        title: `<strong>${manga[0].originalName} - ${name}</strong>`,
        body: "Truyện bạn theo dõi đã có chapter mới, xem ngay!",
        objectId: chapterID,
        url: `https://yurineko.moe/read/${mangaID}/${chapterID}`,
        thumbnail: manga[0].thumbnail,
        icon: "follow-new-chapter",
    });

    await n.save();
});

const editChapter = AsyncCatch(async (req, res, next) => {
    const { id } = validator(chapterValidator(["id"]), req.params);

    const checkExist = await db.queryPlaceholdersAsync(
        "SELECT EXISTS(SELECT 1 FROM chapter WHERE id = ?) AS exist",
        [id]
    );
    if (checkExist[0].exist == 0)
        throw new BadRequest("Chapter không tồn tại!");

    const { name } = validator(chapterValidator(["name"]), req.body);
    if (name)
        await db.queryPlaceholdersAsync(
            "UPDATE chapter SET name = ? WHERE id = ?",
            [sanitizeHtml(name), id]
        );
    if (req.files && req.files.length > 0) {
        let iterator = 0;
        const t = await db.queryPlaceholdersAsync(
            "SELECT m.id AS id FROM manga m, chapter c WHERE c.id = ? AND m.id = c.mangaID",
            [id]
        );
        const mangaID = t[0].id;
        const dir = resolve(`${STORAGE_DIR}/manga/${mangaID}/chapters/${id}`);
        fs.rmSync(dir, { force: true, recursive: true });
        fs.mkdirSync(dir);
        req.files.sort((a, b) =>
            a.originalname
                .split(".")[0]
                .localeCompare(b.originalname.split("."), undefined, {
                    numeric: true,
                    sensitivity: "base",
                })
        );
        let url = [];
        await Promise.all(
            req.files.map(async (e) => {
                ++iterator;
                const path = `manga/${mangaID}/chapters/${id}/${iterator}.jpeg`;
                const realPath = `${dir}/${iterator}.jpeg`;
                url.push(`${AWS_S3_HOST_NAME}/${path}`);
                await compress(e.buffer, realPath).catch(async (err) => {
                    return next(
                        new InternalServerError(
                            "Có lỗi xảy ra! Kiểm tra lại chapter và thử lại"
                        )
                    );
                });
            })
        );
        await purgeCloudFlare(url);
        await db.queryPlaceholdersAsync(
            "UPDATE chapter SET maxID = ? WHERE id = ?",
            [iterator, id]
        );
    }
    res.send("Success!");
});

const deleteChapter = AsyncCatch(async (req, res, next) => {
    try {
        const { id } = validator(chapterValidator(["id"]), req.params);

        const checkExist = await db.queryPlaceholdersAsync(
            "SELECT mangaID FROM chapter WHERE id = ? LIMIT 1",
            [id]
        );

        if (checkExist.length == 0) throw BadRequest("Chapter không tồn tại!");

        const mangaID = checkExist[0].mangaID;
        const dir = resolve(
            `${__dirname}/../../../test/manga/${mangaID}/chapters/${id}`
        );
        fs.rmSync(dir, { force: true, recursive: true });

        await db.queryPlaceholdersAsync(
            "UPDATE manga SET totalChapter = totalChapter - 1 WHERE id = ?",
            [checkExist[0].id]
        );
        await db.queryPlaceholdersAsync("DELETE FROM chapter WHERE id = ?", [
            id,
        ]);

        res.send("Success!");
    } catch (error) {
        throw error;
    }
});

module.exports = {
    add: addChapter,
    edit: editChapter,
    delete: deleteChapter,
};
