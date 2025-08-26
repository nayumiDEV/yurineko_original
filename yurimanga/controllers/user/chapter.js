const { AsyncCatch, validator, pagination, storageImage } = require("../../helpers/utilities");
const chapterValidator = require("../../validators/chapter.validator");
const db = require('../../db');
const { BadRequest } = require("../../helpers/response");

const likeChapter = AsyncCatch(async (req, res, next) => {
    const { id, type } = req.body;
    const userID = req.userData.id;

    const chapterReaction = await db.queryPlaceholdersAsync(
        "SELECT type FROM chapter_like WHERE userID = ? AND chapterID = ? LIMIT 1",
        [userID, id]
    )

    if (chapterReaction.length == 0) {
        await db.queryPlaceholdersAsync(
            `INSERT INTO chapter_like (userID, chapterID, type) VALUES (?, ?, ?)`,
            [userID, id, type]
        );
        await db.queryPlaceholdersAsync("UPDATE chapter SET likeCount = likeCount + 1 WHERE id = ?", [id]);
        await db.queryPlaceholdersAsync(
            "INSERT INTO chapter_reaction_count(chapterID, type) VALUES (?, ?) ON DUPLICATE KEY UPDATE reactionCount = reactionCount + 1",
            [id, type])
    } else {
        await db.queryPlaceholdersAsync(
            `UPDATE chapter_like SET type = ? WHERE userID = ? AND chapterID = ?`,
            [type, userID, id]
        )

        await db.queryPlaceholdersAsync("UPDATE chapter SET likeCount = likeCount - 1 WHERE id = ? AND likeCount > 0", [id]);
        await db.queryPlaceholdersAsync("UPDATE chapter_reaction_count SET reactionCount = reactionCount - 1 WHERE chapterID = ? AND type = ? AND reactionCount > 0", [id, chapterReaction[0].type]);
    }
    res.send("Success!");
});

const unlikeChapter = AsyncCatch(async (req, res, next) => {
    const { id } = req.body;
    const userID = req.userData.id;

    const reactionData = await db.queryPlaceholdersAsync(
        "SELECT type FROM chapter_like WHERE userID = ? AND chapterID = ? LIMIT 1", [userID, id]);

    if (reactionData.length === 0) {
        throw new BadRequest('Bạn chưa reaction chapter!');
    }

    await db.queryPlaceholdersAsync(
        `DELETE FROM chapter_like WHERE userID = ? AND chapterID = ?`,
        [userID, id]
    );

    await db.queryPlaceholdersAsync("UPDATE chapter SET likeCount = likeCount - 1 WHERE id = ? AND likeCount > 0", [id]);
    await db.queryPlaceholdersAsync("UPDATE chapter_reaction_count SET reactionCount = reactionCount - 1 WHERE chapterID = ? AND type = ? AND reactionCount > 0", [id, reactionData[0].type]);
    res.send("Success!");
});

const getListUserReaction = AsyncCatch(async (req, res, next) => {
    const { id: chapterId } = req.params;
    const { type, page, pageSize } = req.query;

    const skip = pagination(page, pageSize);

    const result = {};

    const listUser = await db.queryPlaceholdersAsync(
        `SELECT u.name, u.avatar, u.username, type FROM chapter_like cl JOIN user u ON  u.id = cl.userID WHERE chapterID = ? ${type != 'all' ? `AND type = '${type}'` : ''} LIMIT ?, ?`, [chapterId, skip, pageSize]
    )

    result.listUser = listUser.map(user => {
        return {
            ...user,
            avatar: storageImage(user.avatar)
        }
    })

    res.send(result);
})

module.exports = {
    like: likeChapter,
    unlike: unlikeChapter,
    getListUserReaction
}