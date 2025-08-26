const db = require('../../db');
const { AsyncCatch, pagination } = require('../../helpers/utilities');

const NOTI_PER_PAGE = 20;

const listNotification = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page, NOTI_PER_PAGE);

    const uid = req.userData.id;
    const result = await db.queryPlaceholdersAsync(
        "SELECT n.id, title, thumbnail, icon, url, type, createAt, isView, isRead FROM notification n, user_notification un WHERE un.userID = ? AND un.notificationID = n.id ORDER BY createAt DESC LIMIT ?, ?",
        [uid, SKIP, NOTI_PER_PAGE]
    )

    res.send(result);
})

const setView = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;
    await db.queryPlaceholdersAsync("UPDATE user_notification SET isView = 1 WHERE userID = ? AND isView = 0", [uid]);
    res.send("Success!");
})

const markRead = AsyncCatch(async (req, res) => {
    const { id } = req.params;
    await db.queryPlaceholdersAsync("UPDATE user_notification SET isRead = 1 WHERE userID = ? AND notificationID = ?", [req.userData.id, id]);
    res.send("Success!");
})

const markReadAll = AsyncCatch(async (req, res) => {
    const uid = req.userData.id;
    await db.queryPlaceholdersAsync("UPDATE user_notification SET isRead = 1 WHERE userID = ?", [uid]);
    res.send("Success!");
})

module.exports = {
    list: listNotification,
    seen: setView,
    markRead,
    markReadAll
}

