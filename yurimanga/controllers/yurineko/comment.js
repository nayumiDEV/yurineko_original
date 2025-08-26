const { AsyncCatch, validator, pagination } = require("../../helpers/utilities");
const chapterValidator = require('../../validators/chapter.validator');
const db = require('../../db');
const { AWS_S3_HOST_NAME } = require("../../configs/env");
const { getCommentReactionInfo } = require("../../services/comment.service");

const COMMENT_PER_PAGE = 10;

const getComment = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page, COMMENT_PER_PAGE);

    // validate
    const idManga = req.query.mangaID.split('.')[req.query.mangaID.split('.').length - 1];

    const { mangaID, chapterID } = validator(chapterValidator(['mangaID', 'chapterID']), {...req.query, mangaID: idManga});

    const comment = await db.queryPlaceholdersAsync('CALL `GET_COMMENT`( ?, ?, ?, ? )', [mangaID, chapterID, SKIP, COMMENT_PER_PAGE]);
    const resultCount = await db.queryPlaceholdersAsync('SELECT COUNT(1) AS countComment FROM comment WHERE replyID = 0 AND mangaID = ? AND chapterID = ?', [mangaID, chapterID]);

    const data = {};
    data.result = await Promise.all(comment[0].map(async e => {
        if (e.image != null) e.image = `${AWS_S3_HOST_NAME}/${e.image}`;
        e.avatar = `${AWS_S3_HOST_NAME}/${e.avatar}`;
        e.liked = 0;
        e.reactionInfo = await getCommentReactionInfo(e.id)
        if (req.userData) {
            const like = await db.queryPlaceholdersAsync("SELECT (EXISTS (SELECT 1 FROM comment_like WHERE userID = ? AND commentID = ?)) as liked", [req.userData.id, e.id]);
            e.liked = like[0].liked;
            
            const reaction = await db.queryPlaceholdersAsync("SELECT type FROM comment_like WHERE userID = ? AND commentID = ? LIMIT 1", [req.userData.id, e.id])
            e.reaction = {
                type: reaction[0]?.type ?? false
            };
        }
        return e;
    }));
    data.resultCount = resultCount[0].countComment;

    data.deleteAble = false;
    if (req.userData) {
        const mangaTeam = await db.queryPlaceholdersAsync("SELECT teamID FROM manga_team WHERE mangaID = ?", [mangaID]);
        if (req.userData.role == 3 || (mangaTeam.length != 0 && req.userData.teamID == mangaTeam[0].teamID))
            data.deleteAble = true;
    }

    res.send(data);
});

module.exports = {
    get: getComment
}