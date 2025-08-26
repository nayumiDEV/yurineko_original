const { AsyncCatch } = require("../../helpers/utilities");
const db = require('../../db');
module.exports = AsyncCatch(async (req, res, next) => {
    const stats = await db.queryPlaceholdersAsync("SELECT SUM(dailyView) AS totalDailyView, SUM(weeklyView) AS totalWeeklyView, COUNT(id) AS totalManga, SUM(IF(type = 1, 1, 0)) AS totalOrigin, SUM(IF(type = 2, 1, 0)) AS totalDoujin FROM manga");
    const newComment = await db.queryPlaceholdersAsync("SELECT u.name, u.avatar, c.mangaID, c.chapterID, c.content, c.createAt FROM user u, comment c WHERE u.id = c.userID ORDER BY c.id DESC LIMIT 5");
    const newManga = await db.queryPlaceholdersAsync("SELECT m.id, m.originalName AS mangaName, m.type, m.status, m.dailyView, m.lastUpdate, t.name AS teamName, t.url AS teamUrl FROM manga m, team t, manga_team mt WHERE mt.mangaID = m.id AND mt.teamID = t.id ORDER BY m.id DESC LIMIT 5");
    const newUser = await db.queryPlaceholdersAsync("SELECT id, name, email, avatar, confirmed FROM user ORDER BY id DESC LIMIT 5");

    let data = {};
    data.stats = stats[0];
    data.newComment = newComment;
    data.newManga = newManga;
    data.newUser = newUser;

    res.send(data);
})