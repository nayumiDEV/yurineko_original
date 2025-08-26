const env = require("../../configs/env");
const mysql = require("mysql");
const {
  validator,
  AsyncCatch,
  pagination,
  checkID,
} = require("../../helpers/utilities");
const {Forbidden, NotFound} = require('../../helpers/response');
const mangaValidator = require("../../validators/manga.validator");
const db = require("../../db");
const { R18, PAGE_SIZE, HOST, AWS_S3_HOST_NAME } = require("../../configs/env");
const Manga = require("../../class/manga");

const getInfoManga = AsyncCatch(async (req, res, next) => {
  const idManga = req.params.id.split('.')[req.params.id.split('.').length - 1];

  const { id } = validator(mangaValidator(["id"]), { id: idManga });

  const procedure = await db.queryPlaceholdersAsync("CALL `GET_MANGA`(?)", [
    id,
  ]);

  if(procedure[0].length === 0){
    throw new NotFound("Không tìm thấy truyện!");
  }

  if (procedure[0][0].status == 1 && (!req.userData || (req.userData.role <= 2 && req.userData.teamID != procedure[0][0].teamID))) {
    throw new Forbidden("Bạn không thể truy cập truyện này!");
  }

  let result = procedure[0];
  result[0].team = procedure[1];
  result[0].origin = procedure[2];
  result[0].author = procedure[3];
  result[0].tag = procedure[4];
  result[0].couple = procedure[5];
  result[0].chapters = procedure[6];

  result[0].thumbnail = `${env.AWS_S3_HOST_NAME}/${result[0].thumbnail}`;
  // dem het hinh anh len s3

  result[0].chapters.sort((b, a) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  if (req.userData) {
    const list = await db.queryPlaceholdersAsync(
      "SELECT y.listKey FROM user_list ul, yurilist y WHERE ul.listKey = y.id AND userID = ? AND mangaID = ? LIMIT 1",
      [req.userData.id, id]
    );
    const like = await db.queryPlaceholdersAsync(
      "SELECT EXISTS (SELECT 1 FROM manga_like WHERE userID = ? AND mangaID = ? LIMIT 1) AS isLiked",
      [req.userData.id, id]
    );
    const subscribe = await db.queryPlaceholdersAsync(
      "SELECT EXISTS (SELECT 1 FROM manga_subscribe WHERE userID = ? AND mangaID = ? LIMIT 1) AS subscribe",
      [req.userData.id, id]
    );

    const readChapter = await db.queryPlaceholdersAsync("SELECT mangaID, chapterID, name FROM history WHERE mangaID = ? AND userID = ? LIMIT 1", [id, req.userData.id]);

    const userData = {};
    userData.list = list.length === 1 ? list[0].listKey : null;
    userData.like = like[0].isLiked === 1 ? true : false;
    userData.subscribe = subscribe[0].subscribe;
    userData.readChapter = readChapter.length === 1 ? readChapter[0] : null;
    result[0].userData = userData;
  }

  res.send(result[0]);
});

const lastestManga = AsyncCatch(async (req, res, next) => {
  // pagination
  const SKIP = pagination(req.query.page);

  // User data logic
  let uid = 0;
  if (req.userData) uid = req.userData.id;

  // Logic N+1
  const result = await db.queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ? OR m.tagID = ? ) bl ON id = bl.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL ORDER BY lastUpdate DESC LIMIT ?, ?",
    [uid, R18, SKIP, PAGE_SIZE]
  );
  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(*) resultCount FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ? OR m.tagID = ? ) bl ON id = bl.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL",
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
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ? OR m.tagID = ? ) bl ON id = bl.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL ORDER BY RAND() LIMIT 10",
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

const searchByName = AsyncCatch(async (req, res, next) => {
  const name = req.query.query ?? "";
  const SKIP = pagination(req.query.page);
  let uid = 0;
  if (req.userData) uid = req.userData.id;

  // Logic N+1
  const result = await db.queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID WHERE (originalName LIKE CONCAT('%', ? , '%') OR otherName LIKE CONCAT('%', ? , '%')) AND ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL ORDER BY CASE WHEN originalName LIKE CONCAT( ? , '%') THEN 1 WHEN originalName LIKE CONCAT('%', ? ) THEN 3 ELSE 2 END LIMIT ?, ?",
    [uid, name, name, name, name, SKIP, PAGE_SIZE]
  );

  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(1) AS resultCount FROM manga LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID WHERE (originalName LIKE CONCAT('%', ? , '%') OR otherName LIKE CONCAT('%', ? , '%')) AND ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL",
    [uid, name, name]
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

  res.send({
    result,
    resultCount: resultCount[0].resultCount,
  });
});

const searchByType = AsyncCatch(async (req, res, next) => {
  const table = ["tag", "author", "team", "origin", "couple"];
  const id = req.query.id ?? "";
  const type = req.query.type ?? "";
  if (id && type && table.indexOf(type) > -1) {
    const SKIP = pagination(req.query.page);

    let uid = 0;
    if (req.userData) uid = req.userData.id;
    const queryTable = "`" + type + "`";
    const tableName = "`manga" + "_" + type + "`";
    const colName = "`" + type + "ID`";

    const checkId = checkID(id);
    // Logic N+1
    const result = await db.queryPlaceholdersAsync(
      `SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM manga JOIN (SELECT DISTINCT mangaID FROM ${tableName} t1 JOIN ${queryTable} t2 ON t1.${colName} = t2.id WHERE (? = 1 AND t2.id = ?) OR (? = 0 AND t2.url = ?)) q ON q.mangaID = id LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL ORDER BY lastUpdate DESC LIMIT ?, ?`,
      [checkId, id, checkId, id, uid, SKIP, PAGE_SIZE]
    );

    const resultCount = await db.queryPlaceholdersAsync(
      `SELECT COUNT(1) AS resultCount FROM manga JOIN (SELECT DISTINCT mangaID FROM ${tableName} t1 JOIN ${queryTable} t2 ON t1.${colName} = t2.id WHERE  (? = 1 AND t2.id = ?) OR (? = 0 AND t2.url = ?)) q ON q.mangaID = id LEFT JOIN ( SELECT DISTINCT m.mangaID FROM manga_tag m JOIN blacklist b ON m.tagID = b.tagID WHERE b.userID = ?) bl ON id = bl.mangaID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.mangaID IS NULL`,
      [checkId, id, checkId, id, uid]
    );

    const detail = await db.queryPlaceholdersAsync(
      `SELECT * from ${queryTable} where  (? = 1 AND id = ?) OR (? = 0 AND url = ?)`,
      [checkId, id, checkId, id]
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

    res.send({
      result,
      resultCount: resultCount[0].resultCount,
      detail: detail.length > 0 ? detail[0] : {},
    });
  } else throw new Error("Not found");
});

const SORT = Object.freeze({
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3,
  FOLLOW: 4,
  UPDATE: 5,
  CHAPTER: 6,
  DEFAULT: 7
})

const sortQuery = (sort) => {
  switch (sort) {
    case SORT.DAILY:
      return `ORDER BY m.dailyView DESC`;
    case SORT.WEEKLY:
      return `ORDER BY m.weeklyView DESC`;
    case SORT.MONTHLY:
      return `ORDER BY m.monthlyVew DESC`;
    case SORT.FOLLOW:
      return `ORDER BY m.totalFollow DESC`;
    case SORT.UPDATE:
      return `ORDER BY m.lastUpdate DESC`;
    case SORT.CHAPTER:
      return `ORDER BY m.totalChapter DESC`;
    default:
      return ``;
  }
}

const advSearch = AsyncCatch(async (req, res, next) => {
  try {
    const { genre, notGenre, sort, minChapter, status, page } = req.query;
    const SKIP = pagination(page);
    let arrGenres = genre ? genre.split(',') : [];
    let arrNotGenres = notGenre ? notGenre.split(',') : [];

    let query = `SELECT m.id, m.originalName, m.otherName, m.description, m.status, m.type, m.thumbnail, m.lastUpdate FROM manga m, (SELECT * FROM manga_tag GROUP BY mangaID`;
    let subQuery = ``;
    const genreQ = arrGenres.map(e => ` sum(case when tagID = ${parseInt(e, 10)} then 1 else 0 end) > 0`);
    const notGenreQ = arrNotGenres.map(e => ` sum(case when tagID = ${parseInt(e, 10)} then 1 else 0 end) = 0`);
    const uid = req.userData?.id ?? 0;
    genreQ.concat(notGenreQ).forEach((element, index) => {
      if (index === 0) subQuery += ` HAVING${element}`;
      else subQuery += ` AND ${element}`;
    });
    const blacklist = ` AND m.id NOT IN (SELECT DISTINCT m.mangaID FROM blacklist b, manga_tag m WHERE b.tagID = m.tagID AND b.userID = ${uid})`;
    const chapterCondition = ` AND m.totalChapter >= ${minChapter} `;
    const statusConditon = (status >= 2 && status <= 7) ? ` AND m.status = ${status} ` : ``;
    query += `${subQuery}) c WHERE m.ID = c.mangaID ${blacklist + chapterCondition + statusConditon + sortQuery(sort)}`;
    const countQuery = `SELECT COUNT(1) AS resultCount FROM manga m, (SELECT * FROM manga_tag GROUP BY mangaID${subQuery}) c WHERE m.ID = c.mangaID ${blacklist + chapterCondition + statusConditon + sortQuery(sort)}`;

    const data = {};
    data.result = await db.queryPlaceholdersAsync(`${query} LIMIT ?, ?`, [SKIP, PAGE_SIZE]);
    const resultCount = await db.queryPlaceholdersAsync(countQuery);
    data.resultCount = resultCount[0].resultCount;
    await Promise.all(data.result.map(async e => {
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
    }))

    res.send(data);
  } catch (error) {
    console.log(error);
  }
})

module.exports = {
  info: getInfoManga,
  lastest: lastestManga,
  random: randomManga,
  search: searchByName,
  searchType: searchByType,
  advSearch
};
