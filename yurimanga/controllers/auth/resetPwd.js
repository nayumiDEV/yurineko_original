const { AsyncCatch, validator } = require("../../helpers/utilities");
const db = require('../../db');
const userValidator = require("../../validators/user.validator");
const { NotFound, BadRequest } = require("../../helpers/response");
const { HashPassword } = require("../../helpers/jwt");

module.exports = AsyncCatch(async (req, res, next) => {
    const {token} = req.body;
    const {password} = validator(userValidator(['password']), req.body);

    const checkToken = await db.queryPlaceholdersAsync("SELECT id, (resetPasswordExpired < CURRENT_TIMESTAMP()) AS expired FROM user WHERE passwordResetToken = ?", [token]);

    if(checkToken.length == 0) throw new NotFound("Token không hợp lệ!");
    if(checkToken[0].expired == true) throw new BadRequest("Token đã hết hạn!");

    const hashPwd = HashPassword(password);
    db.queryPlaceholdersAsync("UPDATE user SET password = ?, passwordResetToken = NULL, resetPasswordExpired = CURRENT_TIMESTAMP() WHERE id = ?", [hashPwd, checkToken[0].id]);
    res.send("Success!");
})