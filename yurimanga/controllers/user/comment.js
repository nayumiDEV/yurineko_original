const {
    AsyncCatch,
    validator,
    uploadErrHandler,
    mangaUrl,
    pagination,
    storageImage,
} = require("../../helpers/utilities");
const commentValidator = require("../../validators/comment.validator");
const db = require("../../db");
const {
    Unauthorized,
    NotFound,
    InternalServerError,
    BadRequest,
} = require("../../helpers/response");
const { compress } = require("../../helpers/process");
const { AWS_S3_HOST_NAME, STORAGE_DIR, HOST } = require("../../configs/env");
const { resolve } = require('path');
const Notification = require("../../class/notification");
const { getCommentReactionInfo } = require("../../services/comment.service");

const addComment = AsyncCatch(async (req, res, next) => {
    const { content, mangaID, chapterID, replyID } = validator(
        commentValidator(["content", "mangaID", "chapterID", "replyID"]),
        req.body
    );

    if (!req.file && (!content || content.length == 0)) throw new BadRequest("Comment phải có ảnh hoặc nội dung!");

    const insertOp = await db.queryPlaceholdersAsync(
        "INSERT INTO comment (content, mangaID, chapterID, replyID, userID) VALUES (?, ?, ?, ?, ?)",
        [content, mangaID, chapterID, replyID, req.userData.id]
    );
    const id = insertOp.insertId;
    if (req.file) {
        const realPath = resolve(`${STORAGE_DIR}/comment/${id}.jpeg`);
        const path = `comment/${id}.jpeg`;
        await compress(req.file.buffer, realPath)
            .then(async () => {
                await db.queryPlaceholdersAsync(
                    "UPDATE comment SET image = ? WHERE id = ?",
                    [path, id]
                );
            })
            .catch((err) => {
                db.queryPlaceholdersAsync("DELETE FROM comment WHERE id = ?", [
                    id
                ]);
                return next(err);
            });
    }
    const result = await db.queryPlaceholdersAsync(
        "SELECT c.id, c.content, c.image, c.replyID, likeCount, c.createAt, userID, u.name, u.role, u.username, u.avatar, (u.premiumTime > CURRENT_TIMESTAMP()) isPremium, t.id teamID, t.name teamName, t.url  FROM comment c JOIN user u ON c.userID = u.id LEFT JOIN team t ON u.teamID = t.id WHERE c.id = ? LIMIT 1",
        [id]
    );
    const data = result[0];
    if (data.image != null)
        data.image = `${AWS_S3_HOST_NAME}/${data.image}`;
    data.avatar = `${AWS_S3_HOST_NAME}/${data.avatar}`;
    data.liked = 0;
    res.send(data);

    const link = `${HOST}${mangaUrl(mangaID, chapterID)}`;

    const manga = await db.queryPlaceholdersAsync("SELECT originalName FROM manga WHERE id = ? LIMIT 1", [mangaID]);

    let name = manga[0].originalName;
    if (chapterID != 0) {
        const chapter = await db.queryPlaceholdersAsync("SELECT name FROM chapter WHERE id = ? LIMIT 1", [chapterID]);
        name = `${manga[0].originalName} - ${chapter[0].name}`
    }
    if (replyID != 0) {
        var n = new Notification({
            type: "manga_comment_reply",
            title: `<strong>${req.userData.name}</strong>$ đã trả lời bình luận của bạn trong <strong>${name}</strong>`,
            body: content.slice(0, 180),
            url: link,
            objectId: replyID,
            senderId: req.userData.id,
            thumbnail: req.userData.avatar,
            icon: "comment"
        });
        await n.save();
        var comment_follower_noti = new Notification({
            type: "manga_comment_reply_following",
            title: `<strong>${req.userData.name}</strong>$ đã trả lời một bình luận mà bạn đang theo dõi trong <strong>${name}</strong>`,
            body: content.slice(0, 180),
            url: link,
            objectId: replyID,
            senderId: req.userData.id,
            thumbnail: req.userData.avatar,
            icon: "comment"
        })
        await comment_follower_noti.save();
    }

    const team_manga = await db.queryPlaceholdersAsync("SELECT teamID FROM manga_team WHERE mangaID = ? LIMIT 1", [mangaID]);
    if (team_manga[0].teamID != req.userData.teamID) {
        var comment_team_noti = new Notification({
            type: "manga_comment_team",
            title: `<strong>${req.userData.name}</strong>$ đã bình luận về truyện <strong>${name}</strong>`,
            body: content.slice(0, 180),
            url: link,
            objectId: mangaID,
            senderId: req.userData.id,
            thumbnail: req.userData.avatar,
            icon: "comment"
        });
        await comment_team_noti.save();
    }
});

const likeComment = AsyncCatch(async (req, res, next) => {
    const { id, type } = req.body;
    const reactionInfo = await db.queryPlaceholdersAsync(
        "SELECT type FROM comment_like WHERE userID = ? AND commentID = ? LIMIT 1",
        [req.userData.id, id]
    )
    if (reactionInfo.length == 0) {
        await db.queryPlaceholdersAsync(
            "INSERT INTO comment_like (userID, commentID, type) VALUES (?, ?, ?)",
            [req.userData.id, id, type]
        );

        await db.queryPlaceholdersAsync(
            "UPDATE comment SET likeCount = likeCount + 1 WHERE id = ?",
            [id]
        );

        await db.queryPlaceholdersAsync(
            "INSERT INTO comment_reaction_count(commentID, type) VALUES (?, ?) ON DUPLICATE KEY UPDATE reactionCount = reactionCount + 1",
            [id, type])
    } else {
        await db.queryPlaceholdersAsync(
            "UPDATE comment_like SET type = ? WHERE userID = ? AND commentID = ?",
            [type, req.userData.id, id]
        );

        await db.queryPlaceholdersAsync("UPDATE comment SET likeCount = likeCount - 1 WHERE id = ? AND likeCount > 0", [id]);
        await db.queryPlaceholdersAsync("UPDATE comment_reaction_count SET reactionCount = reactionCount - 1 WHERE commentID = ? AND type = ? AND reactionCount > 0", [id, reactionInfo[0].type]);
    }


    res.send("Success!");
    const comment = await db.queryPlaceholdersAsync(
        "SELECT originalName, name, userID, content, c.mangaID, chapterID FROM comment c JOIN manga m ON c.mangaID = m.id LEFT JOIN chapter ch ON c.chapterID = ch.id WHERE c.id = ? LIMIT 1",
        [id]
    )

    if (comment.length > 0) {
        const link = `${HOST}${mangaUrl(comment[0].mangaID, comment[0].chapterID)}`;
        let name = comment[0].originalName;
        if (comment[0].chapterID !== 0) {
            name = `${comment[0].originalName} - ${comment[0].name}`
        }
        if (comment[0].userID != req.userData.id) {
            var n = new Notification({
                type: "manga_comment_like",
                title: `<strong>${req.userData.name}</strong>$ đã bày tỏ cảm xúc về bình luận của bạn trong <strong>${name}</strong>`,
                body: comment[0].content.slice(0, 180),
                url: link,
                objectId: id,
                senderId: req.userData.id,
                thumbnail: req.userData.avatar,
                icon: `reaction-${type}`
            });
            await n.save();
            await n.link();
            // await n.push();
        }
    }
});

const unlikeComment = AsyncCatch(async (req, res, next) => {
    const { id } = validator(commentValidator(['id']), req.body);
    const userID = req.userData.id;

    const reactionData = await db.queryPlaceholdersAsync(
        "SELECT type FROM comment_like WHERE userID = ? AND commentID = ? LIMIT 1",
        [userID, id]
    );

    if (reactionData.length === 0)
        throw new BadRequest("Bạn chưa like comment!");

    await db.queryPlaceholdersAsync(
        `DELETE FROM comment_like where userID = ? AND commentID = ?`,
        [userID, id]
    );
    await db.queryPlaceholdersAsync("UPDATE comment SET likeCount = likeCount - 1 WHERE id = ?", [id]);
    await db.queryPlaceholdersAsync("UPDATE comment_reaction_count SET reactionCount = reactionCount - 1 WHERE commentID = ? AND type = ? AND reactionCount > 0", [id, reactionData[0].type]);
    res.send("Success!");
});

const getListUserReaction = AsyncCatch(async (req, res) => {
    const { id: commentId } = req.params;
    const { type, page, pageSize } = req.query;

    const skip = pagination(page, pageSize);

    const result = {};
    const listUser = await db.queryPlaceholdersAsync(
        `SELECT u.name, u.avatar, u.username, type FROM comment_like cl JOIN user u ON  u.id = cl.userID WHERE commentID = ? ${type != 'all' ? `AND type = '${type}'` : ''} LIMIT ?, ?`, [commentId, skip, pageSize])
    result.listUser = listUser.map(user => {
        return {
            ...user,
            avatar: storageImage(user.avatar)
        }
    })
    // result.reactionCount = await getCommentReactionInfo(commentId);

    res.send(result);
})

module.exports = {
    add: addComment,
    like: likeComment,
    unlike: unlikeComment,
    getListUserReaction
};
