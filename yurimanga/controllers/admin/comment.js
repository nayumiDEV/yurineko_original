const { PAGE_SIZE } = require('../../configs/env');
const db = require('../../db');
const { AsyncCatch, pagination } = require('../../helpers/utilities');

const listComment = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    //logic
    const result = await db.queryPlaceholdersAsync("SELECT c.*, u.name, m.originalName as mangaName FROM comment c, user u, manga m WHERE c.userID = u.id AND m.id = c.mangaID ORDER BY id DESC LIMIT ?, ?", [SKIP, PAGE_SIZE]);
    
    // count rows
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(id) AS resultCount FROM comment");

    // send result
    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;
    res.send(data);
})

module.exports = {
    list: listComment
};