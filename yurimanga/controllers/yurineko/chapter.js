const env = require('../../configs/env');
const db = require('../../db');
const Manga = require('../../class/manga');
const { Forbidden, Unauthorized, NotFound } = require('../../helpers/response');
const { AsyncCatch, validator, listImageChapter, isR18 } = require('../../helpers/utilities');
const chapterValidator = require('../../validators/chapter.validator');
const mangaValidator = require('../../validators/manga.validator');
const { getChapterReactionInfo } = require('../../services/chapter.service');

const getChapter = AsyncCatch(async (req, res, next) => {
    const { id: chapterID } = validator(chapterValidator(['id']), { id: req.params.chapterID });
    const { id: mangaID } = validator(mangaValidator(['id']), { id: req.params.mangaID });

    const result = {};
    const chapterInfo = await db.queryPlaceholdersAsync("SELECT id, name, date, maxID, mangaID, likeCount FROM chapter WHERE id = ?", [chapterID]);
    const mangaInfo = await db.queryPlaceholdersAsync("SELECT m.id, m.originalName, m.status, mt.teamID FROM manga m JOIN manga_team mt ON m.id = mt.mangaID WHERE m.id = ? LIMIT 1", [mangaID]);

    if (mangaInfo.length === 0 || chapterInfo.length === 0 || chapterInfo[0].mangaID !== mangaID)
        throw new NotFound("Chapter không tồn tại!");

    if (mangaInfo[0].status == 1 && (!req.userData || (req.userData.role <= 2 && req.userData.teamID != mangaInfo[0].teamID))) {
        throw new Forbidden("Bạn không thể truy cập truyện này!");
    }

    delete chapterInfo[0].mangaID;
    const manga = new Manga(mangaID);
    result.listChapter = await manga.minListChapter();
    result.chapterInfo = chapterInfo[0];
    result.reactionInfo = await getChapterReactionInfo(chapterID);
    result.mangaInfo = mangaInfo[0];
    result.url = listImageChapter(mangaID, chapterID, chapterInfo[0].maxID);
    if (req.userData) {
        db.queryPlaceholdersAsync("CALL `SET_HISTORY`( ?, ?, ?, ? )", [chapterID, req.userData.id, mangaID, result.chapterInfo.name]);
        const userData = {
            mangaInfo: {},
            chapterInfo: {}
        };

        const chapterInfo = await db.queryPlaceholdersAsync(
            "SELECT EXISTS (SELECT 1 FROM chapter_like WHERE userID = ? AND chapterID = ? LIMIT 1) AS isLiked",
            [req.userData.id, chapterID]
        );
        userData.chapterInfo.like = chapterInfo[0].isLiked;

        const reaction = await db.queryPlaceholdersAsync("SELECT type FROM chapter_like WHERE userID = ? AND chapterID = ? LIMIT 1", [req.userData.id, chapterID])
        userData.chapterInfo.reaction = {
            type: reaction[0]?.type ?? false
        };

        const list = await db.queryPlaceholdersAsync(
            "SELECT y.listKey FROM user_list ul, yurilist y WHERE ul.listKey = y.id AND userID = ? AND mangaID = ? LIMIT 1",
            [req.userData.id, mangaID]
        );

        userData.mangaInfo.list = list.length === 1 ? list[0].listKey : null;

        const mangaLikeSub = await db.queryPlaceholdersAsync(
            "SELECT EXISTS (SELECT 1 FROM manga_like WHERE userID = ? AND mangaID = ? LIMIT 1) AS isLiked, EXISTS (SELECT 1 FROM manga_subscribe WHERE userID = ? AND mangaID = ? LIMIT 1) AS subscribe",
            [req.userData.id, mangaID, req.userData.id, mangaID]
        )

        userData.mangaInfo.like = mangaLikeSub[0].isLiked;
        userData.mangaInfo.subscribe = mangaLikeSub[0].subscribe;
        // result.userData = userData;
        result.chapterInfo.userData = { ...userData.chapterInfo }
        result.mangaInfo.userData = { ...userData.mangaInfo }
    }
    res.send(result);
    db.queryPlaceholdersAsync("UPDATE chapter SET view = view + 1 WHERE id = ?", [chapterID]);
    db.queryPlaceholdersAsync("UPDATE manga SET dailyView = dailyView + 1, weeklyView = weeklyView + 1, monthlyView = monthlyView + 1, totalView = totalView + 1 WHERE id = ?", [mangaID]);
})

module.exports = getChapter;