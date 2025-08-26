const { AsyncCatch, validator } = require("../../helpers/utilities");
const db = require('../../db');
const mangaValidator = require("../../validators/manga.validator");
const { valid } = require("joi");
const { BadRequest } = require("../../helpers/response");

const likeManga = AsyncCatch(async (req, res, next) => {
    const { id } = validator(mangaValidator(['id']), req.body);
    const userID = req.userData.id;
    await db.queryPlaceholdersAsync(
        `INSERT INTO manga_like (userID, mangaID) VALUES (?, ?)`,
        [userID, id]
    );
    await db.queryPlaceholdersAsync("UPDATE manga SET likeCount = likeCount + 1 WHERE id = ?", [id]);
    res.send("Success!");
});

const unlikeManga = AsyncCatch(async (req, res, next) => {
    const { id } = validator(mangaValidator(['id']), req.body);
    const userID = req.userData.id;

    const manga = await db.queryPlaceholdersAsync(
        "SELECT EXISTS(SELECT * FROM manga_like WHERE mangaID = ? AND userID = ?) AS exist",
        [id, userID]
    );

    if (manga[0].exist == false) throw new BadRequest("Bạn chưa like manga!");

    await db.queryPlaceholdersAsync(
        `DELETE FROM manga_like where userID = ? AND mangaID = ?`,
        [userID, id]
    );
    await db.queryPlaceholdersAsync("UPDATE manga SET likeCount = likeCount - 1 WHERE id = ?", [id]);
    res.send("Success!");
});

const subscribeManga = AsyncCatch(async (req, res, next ) => {
    const {id} = validator(mangaValidator(['id']), req.body);
    const uid = req.userData.id;

    await db.queryPlaceholdersAsync("INSERT INTO manga_subscribe (userID, mangaID) VALUES (?, ?)", [uid, id]);

    res.send("Success!");
})

const unsubscribeManga = AsyncCatch(async (req, res, next) =>{
    const {id} = validator(mangaValidator(['id']), req.body);
    const uid = req.userData.id;

    await db.queryPlaceholdersAsync("DELETE FROM manga_subscribe WHERE userID = ? AND mangaID = ?", [uid, id]);

    res.send("Success!");
})

module.exports = {
    like: likeManga,
    unlike: unlikeManga,
    subscribe: subscribeManga,
    unsubscribe: unsubscribeManga
}