const { PAGE_SIZE } = require("../../configs/env");
const db = require("../../db");
const { BadRequest } = require("../../helpers/response");
const {
  AsyncCatch,
  pagination,
  validator,
  deleteQueryHelper,
} = require("../../helpers/utilities");
const coupleValidator = require("../../validators/author.validator");

const listCouple = AsyncCatch(async (req, res, next) => {
  // pagination
  const SKIP = pagination(req.query.page);

  //logic
  const result = await db.queryPlaceholdersAsync(
    "SELECT * FROM couple ORDER BY id DESC LIMIT ?, ?",
    [SKIP, PAGE_SIZE]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const mangaCount = await db.queryPlaceholdersAsync(
        "SELECT COUNT(1) AS mangaCount FROM manga_couple WHERE coupleID = ?",
        [id]
      );
      e.mangaCount = mangaCount[0].mangaCount;
    })
  );

  // count rows
  const resultCount = await db.queryPlaceholdersAsync(
    "SELECT COUNT(1) AS resultCount FROM couple"
  );

  // send result
  const data = {};
  data.result = result;
  data.resultCount = resultCount[0].resultCount;
  res.send(data);
});

const addCouple = AsyncCatch(async (req, res, next) => {
  const { name, url, description } = validator(
    coupleValidator(["name", "url", "description"]),
    req.body
  );

  const checkUrl = await db.queryPlaceholdersAsync(
    "SELECT * FROM couple WHERE url = ?",
    [url]
  );
  if (checkUrl.length != 0) throw BadRequest("URL vừa nhập đã bị trùng!");

  await db.queryPlaceholdersAsync(
    "INSERT INTO couple (url, name, description) VALUES (?, ?, ?)",
    [url, name, description]
  );
  res.send("Success!");
});

const editCouple = AsyncCatch(async (req, res, next) => {
  const { id } = validator(coupleValidator(["id"]), req.params);

  const currentCouple = await db.queryPlaceholdersAsync(
    "SELECT name, description, url FROM couple WHERE id = ?",
    [id]
  );
  if (currentCouple.length === 0) throw new BadRequest("Couple không tồn tại!");

  let body = req.body;
  body.name = body.name || currentCouple[0].name;
  body.description = body.description || currentCouple[0].description;
  body.url = body.url || currentCouple[0].url;

  const { name, url, description } = validator(
    coupleValidator(["name", "url", "description"]),
    body
  );

  const checkUrl = await db.queryPlaceholdersAsync(
    "SELECT id FROM couple WHERE url = ?",
    [url]
  );
  if (checkUrl.length > 1 || (checkUrl.length === 1 && checkUrl[0].id !== id))
    throw new BadRequest("Url đã bị trùng!");
  console.log(description);
  await db.queryPlaceholdersAsync(
    "UPDATE couple SET url = ?, name = ?, description = ? WHERE id = ?",
    [url, name, description, id]
  );

  res.send("Success!");
});

const deleteCouple = AsyncCatch(async (req, res, next) => {
  const { id } = validator(coupleValidator(["id"]), req.params);

  const query = deleteQueryHelper("couple");

  const check = await db.queryPlaceholdersAsync(query.check, [id]);
  if (check.length === 0) throw new BadRequest("Couple không tồn tại!");

  await db.queryPlaceholdersAsync(query.DEL[0], [id]);
  await db.queryPlaceholdersAsync(query.DEL[1], [id]);

  res.send("Success!");
});

const findCouple = AsyncCatch(async (req, res, next) => {
  const query = req.query.query.concat('%') ?? "";
    const result = await db.queryPlaceholdersAsync("SELECT c.*, COUNT(mc.mangaID) mangaCount FROM couple c LEFT JOIN manga_couple mc ON mc.coupleID = c.id WHERE name LIKE ? GROUP BY c.id", [query]);
    res.send(result);
});

module.exports = {
  list: listCouple,
  add: addCouple,
  edit: editCouple,
  delete: deleteCouple,
  find: findCouple,
};
