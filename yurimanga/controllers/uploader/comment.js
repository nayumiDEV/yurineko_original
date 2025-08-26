const { PAGE_SIZE, STORAGE_DIR } = require('../../configs/env');
const db = require('../../db');
const fs = require('fs-extra');
const { resolve } = require('path');
const { NotFound, Unauthorized } = require('../../helpers/response');
const { validator, AsyncCatch, pagination } = require('../../helpers/utilities');
const commentValidator = require('../../validators/comment.validator');
const { checkCommentRights } = require('../../services/comment.service');

const pinComment = AsyncCatch(async (req, res, next) => {
    const { id } = req.params;

    if ((await checkCommentRights(id, req.userData)) == false) {
        throw new Unauthorized("Bạn không có quyền thực hiện hành động này!");
    }

    const data = await db.queryPlaceholdersAsync(
        "SELECT pinCreator FROM comment WHERE id = ?",
        [id]
    );

    if (data[0].pinCreator != null) {
        await db.queryPlaceholdersAsync(
            "UPDATE comment SET pinCreator = NULL, pinCreateAt = NULL WHERE id = ?",
            [id]
        );
    }
    else {
        await db.queryPlaceholdersAsync(
            "UPDATE comment SET pinCreator = ?, pinCreateAt = CURRENT_TIMESTAMP() WHERE id = ?",
            [req.userData.id, id]
        );
    }

    res.send("Success!");
})

const getAllCommentOfMangas = AsyncCatch(async (req, res, next) => {
    const SKIP = pagination(req.query.page);
    const tid = req.userData.teamID;
    const result = await db.queryPlaceholdersAsync(
        "SELECT u.name, u.avatar, c.id, c.mangaID, c.chapterID, c.content, c.image, c.replyID, c.createAt, m.originalName FROM comment c JOIN user u ON c.userID = u.id JOIN manga_team mt ON mt.mangaID = c.mangaID JOIN manga m ON m.id = c.mangaID WHERE mt.teamID = ? ORDER BY c.id DESC LIMIT ?, ?",
        [tid, SKIP, PAGE_SIZE]
    );

    const resultCount = await db.queryPlaceholdersAsync(
        "SELECT COUNT(*) resultCount FROM comment c JOIN manga_team mt ON mt.mangaID = c.mangaID WHERE mt.teamID = ?",
        [tid]
    )
    res.send({ result, resultCount: resultCount[0].resultCount });
});

const deleteComment = AsyncCatch(async (req, res, next) => {
    const { id } = validator(commentValidator(['id']), req.params);
    const comment = await db.queryPlaceholdersAsync("SELECT c.id, c.replyID, c.image, mt.teamID FROM comment c, manga_team mt WHERE c.id = ? AND mt.mangaID = c.mangaID", [id]);
    if (comment.length == 0) throw new NotFound("Không tìm thấy comment!");
    if (req.userData.role == 2 && req.userData.teamID != comment[0].teamID)
        throw new Unauthorized("Bạn không có quyền xóa comment này!");
    if (comment[0].image != null)
        fs.rm(`${STORAGE_DIR}/comment/${id}.jpeg`);
    await db.queryPlaceholdersAsync("DELETE FROM comment WHERE id = ?", [id]);
    if (comment[0].replyID == 0) {
        const replyList = await db.queryPlaceholdersAsync("SELECT id, image FROM comment WHERE replyID = ?", [id]);
        await Promise.all(replyList.map(async ({ id, image }) => {
            if (image != null)
                fs.rm(`${STORAGE_DIR}/comment/${id}.jpeg`);
            await db.queryPlaceholdersAsync("DELETE FROM comment WHERE id = ?", [id]);
        }))
    }
    res.send("Success!");
})

module.exports = {
    get: getAllCommentOfMangas,
    delete: deleteComment,
    pin: pinComment
}