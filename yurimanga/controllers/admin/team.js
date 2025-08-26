const { result, isInteger } = require('lodash');
const { PAGE_SIZE } = require('../../configs/env');
const db = require('../../db');
const { BadRequest } = require('../../helpers/response');
const { AsyncCatch, pagination, validator } = require('../../helpers/utilities');
const teamValidator = require('../../validators/team.validator');
const userValidator = require('../../validators/user.validator');

const listTeam = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    // logic
    const result = await db.queryPlaceholdersAsync("SELECT * FROM team ORDER BY id DESC LIMIT ?, ?", [SKIP, PAGE_SIZE]);

    await Promise.all(result.map(async e => {
        const id = e.id;
        const memberCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS memberCount FROM user WHERE teamID = ?", [id]);
        const mangaCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS mangaCount FROM manga_team WHERE teamID = ?", [id]);
        e.memberCount = memberCount[0].memberCount;
        e.mangaCount = mangaCount[0].mangaCount;
    }))

    // count rows
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS resultCount FROM team");

    // send result
    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;
    res.send(data);
})

const addTeam = AsyncCatch(async (req, res, next) => {
    const { url, name, description } = validator(teamValidator(['url', 'name', 'description']), req.body);

    const checkUrl = await db.queryPlaceholdersAsync("SELECT id FROM team WHERE url = ?", [url]);
    if (checkUrl.length > 1 || (checkUrl.length === 1 && checkUrl[0].id !== id)) throw new BadRequest("Url đã bị trùng!");

    await db.queryPlaceholdersAsync("INSERT INTO `team` (url, name, description, createAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP())", [url, name, description]);

    res.send("Success!");
})

const editTeam = AsyncCatch(async (req, res, next) => {
    const { name, url, description } = validator(teamValidator(['name', 'url', 'description']), req.body);
    const { id } = validator(teamValidator(['id']), req.params);

    const checkID = await db.queryPlaceholdersAsync("SELECT id FROM team WHERE id = ?", [id]);
    if (checkID.length === 0) throw new BadRequest("Team không tồn tại!");

    const checkUrl = await db.queryPlaceholdersAsync("SELECT id FROM team WHERE url = ?", [url]);
    if (checkUrl.length > 1 || (checkUrl.length === 1 && checkUrl[0].id !== id)) throw new BadRequest("Url đã bị trùng!");

    await db.queryPlaceholdersAsync("UPDATE team SET url = ?, name = ?, description = ? WHERE id = ?", [url, name, description, id]);

    res.send("Success!");
})

const deleteTeam = AsyncCatch(async (req, res, next) => {
    const { id } = validator(teamValidator(['id']), req.params);

    const check = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS teamCount FROM team WHERE id = ?", [id]);
    if (check[0].teamCount === 0) throw new BadRequest("Team không tồn tại!");

    const checkTeam = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS mangaCount FROM manga_team WHERE teamID = ?", [id]);
    if (checkTeam[0].mangaCount !== 0) throw new BadRequest("Không thể xoá team đang sở hữu truyện")

    await db.queryPlaceholdersAsync("UPDATE user SET teamID = 1, role = 1 WHERE teamID = ?", [id]);
    await db.queryPlaceholdersAsync("DELETE FROM team WHERE id = ?", [id]);

    res.send("Success!");
})

const info = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    const { id } = validator(teamValidator(['id']), req.params);

    const check = await db.queryPlaceholdersAsync("SELECT id FROM team WHERE id = ?", [id]);
    if (check.length === 0) throw new BadRequest("Team không tồn tại!");

    const result = await db.queryPlaceholdersAsync("SELECT id, name, email, avatar FROM user WHERE teamID = ? LIMIT ?, ?", [id, SKIP, PAGE_SIZE]);
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(id) AS resultCount FROM user WHERE teamID = ?", [id]);

    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;

    res.send(data);
});

const addMember = AsyncCatch(async (req, res, next) => {
    const { id, email } = validator(userValidator(['id', 'email']), req.body);

    const user = await db.queryPlaceholdersAsync("SELECT id FROM user WHERE email = ?", email);
    if (user[0].id === 1) throw new BadRequest("User không xác định!");
    if (id === 1) throw new BadRequest("Không thể thêm vào group default! Hãy dùng phím remove khỏi nhóm!");

    await db.queryPlaceholdersAsync("UPDATE user SET role = 2, teamID = ? WHERE email = ?", [id, email]);

    res.send("Success!");
})

const rmMember = AsyncCatch(async (req, res, next) => {
    const { id } = validator(userValidator(['id']), req.body);
    if (id === 1) throw new BadRequest("User không xác định!");

    const checkUser = await db.queryPlaceholdersAsync("SELECT COUNT(id) AS userCount FROM user WHERE id = ?", [id]);
    if (checkUser[0].userCount !== 1) throw new BadRequest("User không xác định!");

    await db.queryPlaceholdersAsync("UPDATE user SET role = 1, teamID = 1 WHERE id = ?", [id]);

    res.send("Success!");
})

const search = AsyncCatch(async (req, res, next) => {
    try {
        // const query = req.query.query.concat('%') ?? "";
        //     const result = await db.queryPlaceholdersAsync(
        //         "SELECT t.*, COUNT(mt.mangaID) mangaCount, COUNT(u.teamID) memberCount FROM team t LEFT JOIN manga_team mt ON mt.teamID = t.id JOIN user u ON u.teamID = t.id WHERE t.name LIKE ? GROUP BY t.id",
        //         [query]);
        //     res.send(result);

        const query = req.query.query.concat('%') ?? "";
        const result = await db.queryPlaceholdersAsync("SELECT * FROM team WHERE name LIKE ? AND id != 1", [query]);

        await Promise.all(result.map(async e => {
            const id = e.id;
            const memberCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS memberCount FROM user WHERE teamID = ?", [id]);
            const mangaCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS mangaCount FROM manga_team WHERE teamID = ?", [id]);
            e.memberCount = memberCount[0].memberCount;
            e.mangaCount = mangaCount[0].mangaCount;
        }))
        res.send(result);
    } catch (err) { console.log(err) }
})

const changeOwner = AsyncCatch(async (req, res, next) => {
    let body = {};
    Object.keys(req.body).forEach((key) => {
        body[key] = req.body[key];
    });

    const { from, to } = body;

    if (to === 1) throw new BadRequest("Không thể chuyển truyện cho nhóm này!");
    const check = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS checkCount FROM team WHERE id = ? OR id = ?", [from, to]);
    if (check[0].checkCount != 2) throw new BadRequest("Team không hợp lệ!");

    const { mangaID } = body;

    await db.queryPlaceholdersAsync("UPDATE manga_team SET teamID = ? WHERE teamID = ? AND mangaID IN ( ? )", [to, from, mangaID]);

    res.send("Success!");
})

const listManga = AsyncCatch(async (req, res, next) => {
    const { id } = validator(teamValidator(['id']), req.params);
    if (id == 1) throw BadRequest("Không thể tìm nhóm mặc định!");

    const result = await db.queryPlaceholdersAsync("SELECT m.id, m.originalName name FROM manga m, manga_team mt WHERE m.id = mt.mangaID AND mt.teamID = ?", [id]);

    res.send(result);
});

module.exports = {
    add: addTeam,
    addMember: addMember,
    rmMember: rmMember,
    list: listTeam,
    info: info,
    edit: editTeam,
    delete: deleteTeam,
    find: search,
    changeOwner,
    listManga
};
