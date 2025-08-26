const { Unauthorized } = require("../helpers/response");
const { AsyncCatch } = require("../helpers/utilities");

module.exports = AsyncCatch(async (req, res, next) => {
    if(!req.userData)
        throw new Unauthorized("Bạn phải là thành viên để truy cập tài nguyên này!");
    else next();
})
