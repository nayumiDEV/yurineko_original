const { PAGE_SIZE } = require("../../configs/env");
const db = require("../../db");
const { BadRequest } = require("../../helpers/response");
const {
  AsyncCatch,
  pagination,
  validator,
  deleteQueryHelper,
} = require("../../helpers/utilities");
const originValidator = require("../../validators/author.validator");

const listOrigin = AsyncCatch(async (req, res, next) => {
  // pagination
  const SKIP = pagination(req.query.page);

  //logic
  const result = await db.queryPlaceholdersAsync(
    "SELECT * FROM origin ORDER BY id DESC LIMIT ?, ?",
    [SKIP, PAGE_SIZE]
  );

  // for(const key in result){
  //     const id = result[key].id;
  //     const mangaCount = await db.queryPlaceholdersAwait("SELECT COUNT(id) FROM manga_origin WHERE originID = ?", [id]);
  //     result[key].mangaCount = mangaCount[0]['COUNT(id)'];
  // };

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const mangaCount = await db.queryPlaceholdersAsync(
        "SELECT COUNT(*) AS mangaCount FROM manga_origin WHERE originID = ?",
        [id]
      );
      e.mangaCount = mangaCount[0].mangaCount;
    })
  );

  // count rows
  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(id) AS resultCount FROM origin"
  );

  // send result
  const data = {};
  data.result = result;
  data.resultCount = resultCount[0].resultCount;
  res.send(data);
});

const addOrigin = AsyncCatch(async (req, res, next) => {
  const { name, url, description } = validator(
    originValidator(["name", "url", "description"]),
    req.body
  );

  const checkUrl = await db.queryPlaceholdersAsync(
    "SELECT * FROM origin WHERE url = ?",
    [url]
  );
  if (checkUrl.length != 0) throw new BadRequest("URL vừa nhập đã bị trùng!");

  await db.queryPlaceholdersAsync(
    "INSERT INTO origin (url, name, description) VALUES (?, ?, ?)",
    [url, name, description]
  );
  res.send("Success!");
});

const editOrigin = AsyncCatch(async (req, res, next) => {
  const { id } = validator(originValidator(["id"]), req.params);
  const currentOrigin = await db.queryPlaceholdersAsync(
    "SELECT name, description, url FROM origin WHERE id = ?",
    [id]
  );
  if (currentOrigin.length === 0)
    throw new BadRequest("Truyện gốc không tồn tại!");

  let body = req.body;
  body.name = body.name || currentOrigin[0].name;
  body.description = body.description || currentOrigin[0].description;
  body.url = body.url || currentOrigin[0].url;
  const { name, url, description } = validator(
    originValidator(["name", "url", "description"]),
    body
  );

  const checkUrl = await db.queryPlaceholdersAsync(
    "SELECT id FROM team WHERE url = ?",
    [url]
  );
  if (checkUrl.length > 1 || (checkUrl.length === 1 && checkUrl[0].id !== id))
    throw new BadRequest("Url đã bị trùng!");

  await db.queryPlaceholdersAsync(
    "UPDATE origin SET url = ?, name = ?, description = ? WHERE id = ?",
    [url, name, description, id]
  );

  res.send("Success!");
});

const deleteOrigin = AsyncCatch(async (req, res, next) => {
  const { id } = validator(originValidator(["id"]), req.params);

  const checkFK = await db.queryPlaceholdersAsync(
    "SELECT COUNT(*) as originCount FROM manga_origin WHERE originID = ?",
    [id]
  );
  if (checkFK[0].originCount !== 0)
    throw new BadRequest(
      "Không thể xoá truyện gốc đang liên kết đến Doujin khác!"
    );

  const query = deleteQueryHelper("origin");

  const check = await db.queryPlaceholdersAsync(query.check, [id]);
  if (check.length === 0) throw new BadRequest("Truyện gốc không tồn tại!");

  await db.queryPlaceholdersAsync(query.DEL[0], [id]);
  await db.queryPlaceholdersAsync(query.DEL[1], [id]);

  res.send("Success!");
});

const findOrigin = AsyncCatch(async (req, res, next) => {
  const query = req.query.query.concat('%') ?? "";
  const result = await db.queryPlaceholdersAsync("SELECT o.*, COUNT(mo.mangaID) mangaCount FROM origin o LEFT JOIN manga_origin mo ON mo.originID = o.id WHERE name LIKE ? GROUP BY o.id", [query]);
  res.send(result);
});

module.exports = {
  add: addOrigin,
  list: listOrigin,
  edit: editOrigin,
  delete: deleteOrigin,
  find: findOrigin
};
