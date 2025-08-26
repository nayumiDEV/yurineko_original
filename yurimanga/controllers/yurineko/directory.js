const db = require('../../db');
const { AsyncCatch } = require('../../helpers/utilities');

const coupleDir = AsyncCatch(async () => {
    const result = await db.queryPlaceholdersAsync("SELECT DISTINCT c.id, c.url, c.name, o.name origin FROM couple c JOIN manga_couple mc ON mc.coupleID = c.id JOIN manga_origin mo ON mo.mangaID =  mc.mangaID JOIN origin o ON o.id = mo.originID");
    return result;
})

/**
 * Truyện gốc có type = 1
 */
const generalDir = AsyncCatch(async (req, res, next) => {
    const result = await db.queryPlaceholdersAsync(
        "SELECT id, originalName FROM manga WHERE type = 1 AND (status != 1 AND (status = 3 OR totalChapter!=0))"
    );
    return result;
})

/**
 * Directory Origin
 */
const originDir = AsyncCatch(async (req, res, next) => {
    const result = await db.queryPlaceholdersAsync(
        "SELECT id, name, url FROM origin"
    );
    return result;
})

module.exports = AsyncCatch(async (req, res, next) => {
    switch (req.params.type) {
        case 'couple':
            res.send(await coupleDir());
            break;
        case 'origin':
            res.send(await originDir());
            break;
        case 'general':
            res.send(await generalDir());
            break;
    }
})