const { AsyncCatch, pagination } = require("../../helpers/utilities");
const db = require('../../db');
const { PAGE_SIZE } = require("../../configs/env");
const getReport = AsyncCatch(async (req, res, next) => {
    const SKIP = pagination(req.query.page);

    const tid = req.userData.teamID;

    const listReport = await db.queryPlaceholdersAsync("SELECT m.originalName mangaName, c.name chapterName, l.chapterID, l.mangaID, l.type, l.detail, l.createAt FROM log_report_error l JOIN manga_team mt ON mt.mangaID = l.mangaID JOIN manga m ON m.id = l.mangaID JOIN chapter c ON c.id = l.chapterID WHERE mt.teamID = ? ORDER BY l.id DESC LIMIT ?, ?", [tid, SKIP, PAGE_SIZE]);
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS resultCount FROM log_report_error l, manga_team mt WHERE l.mangaID = mt.mangaID AND mt.teamID = ?", [tid]);
    res.send({
        result: listReport,
        resultCount: resultCount[0].resultCount
    })
})

module.exports = {
    list: getReport
}