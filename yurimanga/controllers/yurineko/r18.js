const env = require("../../configs/env");
const mysql = require("mysql");
const {
  validator,
  AsyncCatch,
  pagination,
} = require("../../helpers/utilities");
const mangaValidator = require("../../validators/manga.validator");
const db = require("../../db");
const { R18, PAGE_SIZE, HOST, AWS_S3_HOST_NAME } = require("../../configs/env");
const Manga = require("../../class/manga");
const { Unauthorized } = require("../../helpers/response");

const lastestManga = AsyncCatch(async (req, res, next) => {
  // pagination
  const SKIP = pagination(req.query.page);

  // User data logic
  let uid = 0;
  if (req.userData) uid = req.userData.id;

  // Logic N+1
  const result = await db.queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL ORDER BY lastUpdate DESC LIMIT ?, ?",
    [uid, R18, SKIP, PAGE_SIZE]
  );
  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(r.mangaID) resultCount FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) )",
    [uid, R18]
  );
  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const manga = new Manga(id);
      e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
      if (e.type === 1) {
        e.origin = [];
        e.couple = [];
      } else {
        e.origin = await manga.getOrigin();
        e.couple = await manga.getCouple();
      }
      e.author = await manga.getAuthor();
      e.team = await manga.getTeam();
      e.tag = await manga.getTag();
      e.lastChapter = await manga.lastChapter();
    })
  );

  res.send({
    result,
    resultCount: resultCount[0].resultCount,
  });
});

const randomManga = AsyncCatch(async (req, res, next) => {
  // User data logic
  let uid = 0;
  if (req.userData) uid = req.userData.id;


  // Logic N+1
  const result = await db.queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID  LEFT JOIN (SELECT mangaID FROM manga_tag WHERE tagID = ?) r ON id = r.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL AND r.mangaID IS NOT NULL ORDER BY RAND() LIMIT 10",
    [uid, R18]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const manga = new Manga(id);
      e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
      if (e.type === 1) {
        e.origin = [];
        e.couple = [];
      } else {
        e.origin = await manga.getOrigin(id);
        e.couple = await manga.getCouple(id);
      }
      e.author = await manga.getAuthor(id);
      e.team = await manga.getTeam(id);
      e.tag = await manga.getTag(id);
      e.lastChapter = await manga.lastChapter(id);
    })
  );

  res.send(result);
});

module.exports = {
  lastest: lastestManga,
  random: randomManga
};
