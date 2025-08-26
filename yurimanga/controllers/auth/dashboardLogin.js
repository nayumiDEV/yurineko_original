const { AsyncCatch, validator } = require("../../helpers/utilities");
const { BadRequest } = require('../../helpers/response');
const userValidator = require("../../validators/user.validator");
const { signData, compareHashString } = require('../../helpers/jwt');
const db = require('../../db');

module.exports = AsyncCatch(async (req, res, next) => {
    const { email } = validator(userValidator(['email']), req.body);
    const { password } = req.body;
    const result = await db.queryPlaceholdersAsync("SELECT id, email, password, role, (bannedTime > CURRENT_TIMESTAMP()) as isBanned FROM user WHERE email = ?", [email]);

    const user = result[0];

    if (!user)
        throw new BadRequest("Email hoặc password sai!");

    // not admin / uploader
    if (user.role < 2)
        throw new BadRequest("Bạn không có quyền hạn để truy cập!");

    if (user.isBanned == true)
        throw new BadRequest("Bạn đã bị ban!");

    let isCorrect = await compareHashString(password, user.password);
    if (!isCorrect)
        throw new BadRequest("Email hoặc password sai!");

    res.send({
        id: user.id,
        role: user.role,
        token: signData(user)
    });
});