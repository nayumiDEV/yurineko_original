const Manga = require("../../class/manga");
const { PAGE_SIZE, AWS_S3_HOST_NAME } = require("../../configs/env");
const db = require("../../db");
const {
  Unauthorized,
  BadRequest,
  NotFound,
} = require("../../helpers/response");
const {
  AsyncCatch,
  validator,
  uploadErrHandler,
  pagination,
} = require("../../helpers/utilities");

const getList = AsyncCatch(async (req, res, next) => {
  const SKIP = pagination(req.query.page);

  const param = req.params.param;
  let flagAll = false;
  let getListName = [];
  if (param != "all") {
    getListName = await db.queryPlaceholdersAsync(
      "SELECT id FROM yurilist y WHERE y.listKey = ?",
      [param]
    );
    if (getListName.length == 0) throw new NotFound("List không tồn tại!");
  } else flagAll = true;
  const result = await db.queryPlaceholdersAsync(
    "SELECT m.id, m.originalName, m.otherName, m.thumbnail, m.type, m.lastUpdate, y.listKey FROM manga m, user_list ul JOIN yurilist y ON y.id = ul.listKey WHERE m.id = ul.mangaID AND ul.userID = ? AND (? OR ul.listKey = ?) ORDER BY ul.createAt DESC LIMIT ?, ?",
    [
      req.userData.id,
      flagAll,
      getListName.length == 0 ? 1 : getListName[0].id,
      SKIP,
      PAGE_SIZE,
    ]
  );

  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(1) AS resultCount FROM manga m, user_list ul WHERE m.id = ul.mangaID AND ul.userID = ? AND (? OR listKey = ?)",
    [req.userData.id, flagAll, getListName.length == 0 ? 1 : getListName[0].id]
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

  const data = {};
  data.result = result;
  data.resultCount = resultCount[0].resultCount;

  res.send(data);
});

const likeList = AsyncCatch(async (req, res, next) => {
  const uid = req.userData.id;
  const result = await db.queryPlaceholdersAsync(
    "SELECT m.id, m.originalName, m.otherName, m.thumbnail, m.type, m.lastUpdate FROM manga m JOIN manga_like ml ON m.id = ml.mangaID WHERE ml.userID = ? ORDER BY ml.createAt DESC",
    [uid]
  );
  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(*) resultCount FROM manga m JOIN manga_like ml ON m.id = ml.mangaID WHERE ml.userID = ?",
    [uid]
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

  const data = {};
  data.result = result;
  data.resultCount = resultCount[0].resultCount;
  res.send(data);
})

const addToList = AsyncCatch(async (req, res, next) => {
  try {
    const userID = req.userData.id;
    const mangaID = req.body.mangaID;
    const listKey = req.body.listKey;
    if (userID && mangaID && listKey) {
      const list = await db.queryPlaceholdersAsync(
        "SELECT id from yurilist y where y.listKey = ?",
        [listKey]
      );

      if (list.length == 0 && oldList.length == 0) throw BadRequest("List không tồn tại!");

      const id = list[0].id;
      if (id) {
        await db.queryPlaceholdersAsync(
          "INSERT INTO user_list (userID, mangaID, listKey) VALUES (?, ?, ?)",
          [userID, mangaID, id]
        );
        const col = `${listKey}List`;
        db.queryPlaceholdersAsync(`UPDATE manga SET totalFollow = totalFollow + 1, ${col} = ${col} + 1 WHERE id = ?`,
          [mangaID]);
        res.send("Success!");
      }
    } else {
      next(new BadRequest("Thiếu dữ liệu"));
    }
  } catch (err) {
    next(err);
  }
});

const removeFromList = AsyncCatch(async (req, res, next) => {
  try {
    const userID = req.userData.id;
    const mangaID = req.body.mangaID;
    const listKey = req.body.listKey;
    if (userID && mangaID && listKey) {
      const list = await db.queryPlaceholdersAsync(
        "SELECT id from yurilist y where y.listKey = ?",
        [listKey]
      );
      const id = list[0].id;

      if (list.length == 0) throw BadRequest("List không tồn tại!");

      await db.queryPlaceholdersAsync(
        "DELETE from user_list where userID = ? AND mangaID = ? AND listKey = ?",
        [userID, mangaID, id]
      );
      const col = `${listKey}List`;
      db.queryPlaceholdersAsync(`UPDATE manga SET totalFollow = totalFollow - 1, ${col} = ${col} - 1 WHERE id = ?`,
        [mangaID]);
      res.send("Success!");
    } else {
      next(new BadRequest("Lỗi không xác định"));
    }
  } catch (err) {
    console.log(err);
    next();
  }
});

const changeList = AsyncCatch(async (req, res, next) => {
  try {
    const userID = req.userData.id;
    const mangaID = req.body.mangaID;
    const listKey = req.body.listKey;
    const oldListKey = req.body.oldListKey;
    if (userID && mangaID && listKey) {
      const list = await db.queryPlaceholdersAsync(
        "SELECT id from yurilist y where y.listKey = ?",
        [listKey]
      );
      const oldList = await db.queryPlaceholdersAsync(
        "SELECT id from yurilist y where y.listKey = ?",
        [oldListKey]
      );

      if (list.length == 0 && oldList.length == 0) throw BadRequest("List không tồn tại!");

      const id = list[0].id;
      const oldID = oldList[0].id;
      await db.queryPlaceholdersAsync(
        "UPDATE user_list set listKey = ? where userID = ? AND mangaID = ? AND listKey = ?",
        [id, userID, mangaID, oldID]
      );
      const oldCol = `${oldListKey}List`;
      const col = `${listKey}List`;
      db.queryPlaceholdersAsync(`UPDATE manga SET ${col} = ${col} + 1, ${oldCol} = ${oldCol} - 1 WHERE id = ?`,
        [mangaID]);
      res.send("Success!");
    } else {
      next(new BadRequest("Lỗi không xác định"));
    }
  } catch (err) {
    next();
  }
});

const history = AsyncCatch(async (req, res, next) => {
  const SKIP = pagination(req.query.page);

  const result = await db.queryPlaceholdersAsync(
    "SELECT m.id, m.originalName, m.otherName, m.thumbnail, m.type, m.lastUpdate FROM manga m JOIN history h ON m.id = h.mangaID WHERE h.userID = ? ORDER BY lastRead DESC LIMIT ?, ?",
    [req.userData.id, SKIP, PAGE_SIZE]
  );

  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(1) AS resultCount FROM manga m JOIN history h ON m.id = h.mangaID WHERE h.userID = ?",
    [req.userData.id]
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

  const data = {};
  data.result = result;
  data.resultCount = resultCount[0].resultCount;

  res.send(data);
});

module.exports = {
  getList,
  addToList,
  removeFromList,
  changeList,
  history,
  likeList
};
