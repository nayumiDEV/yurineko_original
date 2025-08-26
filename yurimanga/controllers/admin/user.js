const { isInteger } = require('lodash');
const { PAGE_SIZE } = require('../../configs/env');
const db = require('../../db');
const { BadRequest } = require('../../helpers/response');
const { AsyncCatch, pagination, validator } = require('../../helpers/utilities');
const authorValidator = require('../../validators/author.validator');
const userValidator = require('../../validators/user.validator');

const listUser = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    // logic
    const result = await db.queryPlaceholdersAsync("SELECT u.id, u.name, u.userName, u.email, u.teamID, u.role, u.createAt, u.lastLogin, u.gender, u.avatar, u.facebook, u.phone, u.money, (u.bannedTime > CURRENT_TIMESTAMP()) AS isBanned, (u.premiumTime > CURRENT_TIMESTAMP()) as isPremium, t.name AS teamName FROM user u, team t WHERE u.teamID = t.id LIMIT ?, ?", [SKIP, PAGE_SIZE]);

    // count rows
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(id) AS resultCount FROM user");

    // send result
    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;
    res.send(data);
})

const banUser = AsyncCatch(async (req, res, next) => {
    const { id } = validator(userValidator(['id']), req.body);
    const isDeleteComment = req.body.isDeleteComment ?? false;
    const reason = req.body.reason ?? "";

    const user = await db.queryPlaceholdersAsync("SELECT (bannedTime > CURRENT_TIMESTAMP()) isBanned, role FROM user WHERE id = ?", [id]);
    if (user.length == 0) {
        throw new BadRequest("User không tồn tại!");
    }

    if(user[0].role === 3) {
        throw new BadRequest("Không thể ban admin!");
    }

    if (user[0].isBanned == true) {
        await unbanUser(id);
        return res.send("Success!");
    }

    const time = parseInt(req.body.time);
    if (!time) throw new BadRequest("Time phải là số nguyên!");

    const current = new Date();
    const banUntil = new Date(current.setTime(current.getTime() + time * 86400000));

    await db.queryPlaceholdersAsync("UPDATE user SET bannedTime = ? WHERE id = ?", [banUntil, id]);

    if (isDeleteComment && isDeleteComment == true) {
        await db.queryPlaceholdersAsync("DELETE FROM comment WHERE userID = ?", [id]);
        await db.queryPlaceholdersAsync("DELETE FROM lcomment WHERE userID = ?", [id]);
    }

    await db.queryPlaceholdersAsync("INSERT INTO user_ban(userID, reason, expireAt, createdBy) VALUES (?, ?, ?, ?)",
        [id, reason, banUntil, req.userData.id]);

    res.send("Success!");
})

const unbanUser = async (userId) => {
    await db.queryPlaceholdersAsync("UPDATE user SET bannedTIme = CURRENT_TIMESTAMP() WHERE id = ?", [userId]);
    await db.queryPlaceholdersAsync("UPDATE user_ban SET status = 'REMOVED' WHERE userID = ? AND status = 'ACTIVE'", [userId]);
};

const findUser = AsyncCatch(async (req, res, next) => {
    let query = req.query.query;

    const searchToken = '%'.concat(query.concat('%'));

    const data = await db.queryPlaceholdersAsync("SELECT u.id, u.name, u.userName, u.email, u.teamID, u.role, u.createAt, u.lastLogin, u.gender, u.avatar, u.facebook, u.phone, u.money, (u.bannedTime > CURRENT_TIMESTAMP()) AS isBanned, (u.premiumTime > CURRENT_TIMESTAMP()) as isPremium, t.name AS teamName FROM user u, team t WHERE (email LIKE ? OR u.username LIKE ?) AND t.id = u.teamID ORDER BY CASE WHEN (email = ? OR username = ?) THEN 1 WHEN (email LIKE CONCAT(?, '%') OR username = CONCAT(?, '%')) THEN 2 ELSE 3 END LIMIT 20", [searchToken, searchToken, query, query, query, query]);

    res.send(data);
})

module.exports = {
    list: listUser,
    find: findUser,
    ban: banUser
};