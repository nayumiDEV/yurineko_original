const { PAGE_SIZE } = require('../../configs/env');
const db = require('../../db');
const { AsyncCatch, pagination } = require('../../helpers/utilities');

const listManga = AsyncCatch(async (req, res, next) => {
    try {
        // pagination
        const SKIP = pagination(req.query.page);

        //logic
        const result = await db.queryPlaceholdersAsync("SELECT * FROM manga ORDER BY lastUpdate DESC LIMIT ?, ?", [SKIP, PAGE_SIZE]);

        await Promise.all(result.map(async e => {
            const id = e.id;
            const team = await db.queryPlaceholdersAsync("SELECT * FROM team WHERE id IN (SELECT teamID FROM manga_team WHERE mangaID = ?)", [id]);
            e.team = team[0];
        }))

        // count rows
        const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) AS resultCount FROM manga");

        // send result
        const data = {};
        data.result = result;
        data.resultCount = resultCount[0].resultCount;
        res.send(data);
    } catch (err) {
        console.log(err)
    }
})

module.exports = {
    list: listManga
};
