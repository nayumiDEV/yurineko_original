const { PAGE_SIZE } = require('../../configs/env');
const db = require('../../db');
const { BadRequest } = require('../../helpers/response');
const { AsyncCatch, pagination, validator } = require('../../helpers/utilities');
const donateValidator = require('../../validators/donate.validator');

const listDonate = AsyncCatch(async (req, res, next) => {
    // pagination
    const SKIP = pagination(req.query.page);

    //logic
    const result = await db.queryPlaceholdersAsync("SELECT u.name, u.username, u.email, d.* FROM user u, donate d WHERE u.id = d.userID ORDER BY d.id DESC LIMIT ?, ?", [SKIP, PAGE_SIZE]);
    
    // count rows
    const resultCount = await db.queryPlaceholdersAsync("SELECT COUNT(id) AS resultCount FROM donate");

    // send result
    const data = {};
    data.result = result;
    data.resultCount = resultCount[0].resultCount;
    res.send(data);
})

const addDonate = AsyncCatch(async (req, res, next) => {
    const {userID, type, money} = validator(donateValidator(['userID', 'type', 'money']), req.body);

    const checkUser = await db.queryPlaceholdersAsync("SELECT * FROM user WHERE id = ?", [userID]);
    if(checkUser.length === 0) throw new BadRequest("User không tồn tại!");

    await db.queryPlaceholdersAsync("INSERT INTO donate (userID, type, money, time) VALUES (?, ?, ?, CURRENT_TIMESTAMP())", [userID, type, money]); 
    await db.queryPlaceholdersAsync("UPDATE user SET money = money + ? WHERE id = ?", [money, userID]);

    res.send("Success!"); 
})

module.exports = {
    add: addDonate,
    list: listDonate
};