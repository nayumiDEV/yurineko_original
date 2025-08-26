const { PAGE_SIZE } = require("../../configs/env");
const db = require("../../db");
const { BadRequest } = require("../../helpers/response");
const {
  AsyncCatch,
  pagination,
  validator,
  deleteQueryHelper,
} = require("../../helpers/utilities");
const tagValidator = require("../../validators/author.validator");

const listTag = AsyncCatch(async (req, res, next) => {
  // pagination
  const SKIP = pagination(req.query.page);

  //logic
  const result = await db.queryPlaceholdersAsync(
    "SELECT * FROM tag ORDER BY id DESC LIMIT ?, ?",
    [SKIP, PAGE_SIZE]
  );

  // for(const key in result){
  //     const id = result[key].id;
  //     const mangaCount = await db.queryPlaceholdersAwait("SELECT COUNT(id) FROM manga_tag WHERE tagID = ?", [id]);
  //     result[key].mangaCount = mangaCount[0]['COUNT(id)'];
  // };

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const mangaCount = await db.queryPlaceholdersAsync(
        "SELECT COUNT(1) AS mangaCount FROM manga_tag WHERE tagID = ?",
        [id]
      );
      e.mangaCount = mangaCount[0].mangaCount;
    })
  );

  // count rows
  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(1) AS resultCount FROM tag"
  );

  // send result
  const data = {};
  data.result = result;
  data.resultCount = resultCount[0].resultCount;
  res.send(data);
});

const addTag = AsyncCatch(async (req, res, next) => {
  const { name, url, description } = validator(
    tagValidator(["name", "url", "description"]),
    req.body
  );

  const checkUrl = await db.queryPlaceholdersAsync(
    "SELECT * FROM tag WHERE url = ?",
    [url]
  );
  if (checkUrl.length != 0) throw new BadRequest("URL vừa nhập đã bị trùng!");

  await db.queryPlaceholdersAsync(
    "INSERT INTO tag (url, name, description) VALUES (?, ?, ?)",
    [url, name, description]
  );
  res.send("Success!");
});

const editTag = AsyncCatch(async (req, res, next) => {
  const { id } = validator(tagValidator(["id"]), req.params);
  const currentTag = await db.queryPlaceholdersAsync(
    "SELECT name, description, url FROM tag WHERE id = ?",
    [id]
  );
  if (currentTag.length === 0) throw new BadRequest("Tag không tồn tại!");

  let body = req.body;
  body.name = body.name || currentTag.name;
  body.description = body.description || currentTag.description;
  body.url = body.url || currentTag.url;
  const { name, url, description } = validator(
    tagValidator(["name", "url", "description"]),
    body
  );

  const checkUrl = await db.queryPlaceholdersAsync(
    "SELECT id FROM tag WHERE url = ?",
    [url]
  );
  if (checkUrl.length > 1 || (checkUrl.length === 1 && checkUrl[0].id !== id))
    throw new BadRequest("Url đã bị trùng!");

  await db.queryPlaceholdersAsync(
    "UPDATE tag SET url = ?, name = ?, description = ? WHERE id = ?",
    [url, name, description, id]
  );

  res.send("Success!");
});

const deleteTag = AsyncCatch(async (req, res, next) => {
  const { id } = validator(tagValidator(["id"]), req.params);

  const query = deleteQueryHelper("tag");

  const check = await db.queryPlaceholdersAsync(query.check, [id]);
  if (check.length === 0) throw new BadRequest("Tag không tồn tại!");

  await db.queryPlaceholdersAsync(query.DEL[0], [id]);
  await db.queryPlaceholdersAsync(query.DEL[1], [id]);

  res.send("Success!");
});

const findTag = AsyncCatch(async (req, res, next) => {
  const query = req.query.query.concat('%') ?? "";
  const result = await db.queryPlaceholdersAsync("SELECT t.*, COUNT(mt.mangaID) mangaCount FROM tag t LEFT JOIN manga_tag mt ON mt.tagID = t.id WHERE name LIKE ? GROUP BY t.id", [query]);
  res.send(result);
});

module.exports = {
  add: addTag,
  list: listTag,
  edit: editTag,
  delete: deleteTag,
  find: findTag,
};
