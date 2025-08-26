const { isEmpty } = require('lodash');
const db = require('../../db');
const { AsyncCatch } = require('../../helpers/utilities');
const { R18, AWS_S3_HOST_NAME } = require('../../configs/env');
const { BadRequest } = require('../../helpers/response');
const Manga = require('../../class/manga');

const blacklist = 'SELECT DISTINCT m.mangaID FROM `blacklist` b, manga_tag m where (b.tagID = m.tagID and b.userID = ?) or m.tagID = ';

const viewRanking = async (uid) => {
    const query = 'SELECT id, originalName, thumbnail,';
    const result = {};

    // Daily View
    result.day = await db.queryPlaceholdersAsync(`${query} dailyView AS counter, (RANK() OVER (ORDER BY dailyView DESC)) AS rank FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL LIMIT 5`, [uid, R18]);
    await Promise.all(result.day.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }))

    // Weekly View
    result.week = await db.queryPlaceholdersAsync(`${query} weeklyView AS counter, (RANK() OVER (ORDER BY weeklyView DESC)) AS rank FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL LIMIT 5`, [uid, R18]);
    await Promise.all(result.week.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }))

    // Monthly View
    result.month = await db.queryPlaceholdersAsync(`${query} monthlyView AS counter, (RANK() OVER (ORDER BY monthlyView DESC)) AS rank FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL LIMIT 5`, [uid, R18]);
    await Promise.all(result.month.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }))

    // Total View
    result.total = await db.queryPlaceholdersAsync(`${query} totalView AS counter, (RANK() OVER (ORDER BY totalView DESC)) AS rank FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL LIMIT 5`, [uid, R18]);
    await Promise.all(result.total.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }))

    return result;
}

const listRanking = async (uid) => {
    const query = 'SELECT id, originalName, thumbnail,';

    const result = await db.queryPlaceholdersAsync(`${query} totalFollow AS counter, (RANK() OVER (ORDER BY totalFollow DESC)) AS rank FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL LIMIT 5`, [uid, R18]);
    await Promise.all(result.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }))

    return result;
}

const likeRanking = async (uid) => {
    const query = 'SELECT id, originalName, thumbnail,';
    const result = await db.queryPlaceholdersAsync(`${query} likeCount AS counter, (RANK() OVER (ORDER BY likeCount DESC)) AS rank FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL LIMIT 5`, [uid, R18]);
    await Promise.all(result.map(async e => {
        const manga = new Manga(e.id);
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
        e.lastChapter = await manga.lastChapter();
        e.author = await manga.getAuthor();
    }));
    return result;
}

module.exports = AsyncCatch(async (req, res, next) => {
    const type = req.params.type;
    const uid = req.userData ? req.userData.id : 0;
    switch (type) {
        case 'view':
            res.send(await viewRanking(uid));
            break;
        case 'list':
            res.send(await listRanking(uid));
            break;
        case 'like':
            res.send(await likeRanking(uid));
            break;
        default:
            throw BadRequest("Wrong ranking type!");
    }
})