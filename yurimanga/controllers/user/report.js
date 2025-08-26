const db = require('../../db');
const { BadRequest } = require('../../helpers/response');
const { AsyncCatch, validator } = require('../../helpers/utilities');
const reportValidator = require('../../validators/report.validator');


const createReport = AsyncCatch(async (req, res, next) => {
    const { chapterID, mangaID, type, detail } = validator(reportValidator(['chapterID', 'mangaID', 'type', 'detail']), req.body);

    const check = await db.queryPlaceholdersAsync("SELECT EXISTS(SELECT 1 FROM chapter WHERE id = ? AND mangaID = ? LIMIT 1) AS exist", [chapterID, mangaID]);
    if (check[0].exist == false) throw new BadRequest("Đối tượng report không hợp lệ!");

    await db.queryPlaceholdersAsync("INSERT INTO log_report_error (chapterID, mangaID, type, detail) VALUES(?, ?, ?, ?)", [chapterID, mangaID, type, detail]);
    res.send("Success!");
})

module.exports = {
    add: createReport
}