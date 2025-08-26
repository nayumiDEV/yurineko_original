const { AsyncCatch, validator } = require("../../helpers/utilities");
const db = require('../../db');

const getBlacklist = AsyncCatch(async (req, res, next) => {
    const id = req.userData.id;
    const result = await db.queryPlaceholdersAsync("SELECT t.id, t.name FROM tag t, blacklist b WHERE t.id = b.tagID AND b.userID = ?", [id]);
    res.send(result);
})

const addBlacklist = AsyncCatch(async (req, res, next) => {
    const {tagID} = req.body;
    await db.queryPlaceholdersAsync("INSERT INTO blacklist (tagID, userID) VALUES (?, ?)", [tagID, req.userData.id]);
    res.send("Success!");
})

const rmBlacklist = AsyncCatch(async(req, res, next)=>{
    const {id} = req.params;
    await db.queryPlaceholdersAsync("DELETE FROM blacklist WHERE tagID = ? AND userID = ?", [id, req.userData.id]);
    res.send("Success!");
})

module.exports = {
    get: getBlacklist,
    add: addBlacklist,
    remove: rmBlacklist
}