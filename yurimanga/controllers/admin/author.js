const { PAGE_SIZE } = require('../../configs/env');
const db = require('../../db');
const { BadRequest } = require('../../helpers/response');
const { AsyncCatch, pagination, validator, deleteQueryHelper } = require('../../helpers/utilities');
const authorValidator = require('../../validators/author.validator');

const listAuthor = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    //logic N + 1
    const result = await db.queryPlaceholdersAsync("SELECT * FROM author ORDER BY id DESC LIMIT ?, ?", [SKIP, PAGE_SIZE]);

    await Promise.all(result.map(async e => {
        const id = e.id;
        const mangaCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) as mangaCount FROM manga_author WHERE authorID = ?", [id]);
        e.mangaCount = mangaCount[0].mangaCount;
    }))

    // count rows
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(1) as resultCount FROM author");

    // send result
    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;
    res.send(data);
})

const addAuthor = AsyncCatch(async (req, res, next) => {
    const { name, url, description } = validator(authorValidator(['name', 'url', 'description']), req.body);

    const checkUrl = await db.queryPlaceholdersAsync("SELECT * FROM author WHERE url = ?", [url]);
    if (checkUrl.length != 0) throw BadRequest("URL vừa nhập đã bị trùng!")

    await db.queryPlaceholdersAsync("INSERT INTO author (url, name, description) VALUES (?, ?, ?)", [url, name, description]);
    res.send("Success!");
})

const editAuthor = AsyncCatch(async (req, res, next) => {
    const { id } = validator(authorValidator(['id']), req.params);

    const currentAuthor = await db.queryPlaceholdersAsync("SELECT name, description, url FROM author WHERE id = ?", [id]);
    if (currentAuthor.length === 0) throw new BadRequest("Tác giả không tồn tại!");

    let body = req.body;
    body.name = body.name || currentAuthor[0].name;
    body.description = body.description || currentAuthor[0].description;
    body.url = body.url || currentAuthor[0].url;

    const { name, url, description } = validator(authorValidator(['name', 'url', 'description']), body);

    const checkUrl = await db.queryPlaceholdersAsync("SELECT id FROM author WHERE url = ?", [url]);
    if (checkUrl.length > 1 || (checkUrl.length === 1 && checkUrl[0].id !== id)) throw new BadRequest("Url đã bị trùng!");

    await db.queryPlaceholdersAsync("UPDATE author SET url = ?, name = ?, description = ? WHERE id = ?", [url, name, description, id]);

    res.send("Success!");
})

const deleteAuthor = AsyncCatch(async (req, res, next) => {
    const { id } = validator(authorValidator(['id']), req.params);

    const query = deleteQueryHelper('author');

    const check = await db.queryPlaceholdersAsync(query.check, [id]);
    if (check.length === 0) throw new BadRequest("Tác giả không tồn tại!");


    await db.queryPlaceholdersAsync(query.DEL[0], [id]);
    await db.queryPlaceholdersAsync(query.DEL[1], [id]);

    res.send("Success!");
})

const findAuthor = AsyncCatch(async (req, res, next) => {
    const query = req.query.query.concat('%') ?? "";
    const result = await db.queryPlaceholdersAsync("SELECT a.*, COUNT(ma.mangaID) mangaCount FROM author a LEFT JOIN manga_author ma ON ma.authorID = a.id WHERE name LIKE ? GROUP BY a.id", [query]);
    res.send(result);
});

module.exports = {
    add: addAuthor,
    edit: editAuthor,
    list: listAuthor,
    delete: deleteAuthor,
    find: findAuthor,
};