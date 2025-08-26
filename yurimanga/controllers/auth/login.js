const { AsyncCatch, validator } = require("../../helpers/utilities");
const { BadRequest, Forbidden } = require('../../helpers/response');
const userValidator = require("../../validators/user.validator");
const { signData, compareHashString } = require('../../helpers/jwt');
const db = require('../../db');

module.exports = AsyncCatch(async (req, res, next) => {
    const { email } = validator(userValidator(['email']), req.body);
    const { password } = req.body;
    const result = await db.queryPlaceholdersAsync("SELECT id, name, email, avatar, password, role, money, username, confirmed, (bannedTime > CURRENT_TIMESTAMP()) as isBanned, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE email = ?", [email]);

    const user = result[0];

    if (!user)
        throw new BadRequest("Email hoặc password sai!");

    if (user.isBanned == true){
        const ban = await db.queryPlaceholdersAsync("SELECT reason, expireAt FROM user_ban WHERE userID = ? AND status = 'ACTIVE' ORDER BY createdAt DESC LIMIT 1", [user.id]);
        throw new Forbidden({
            message: 'Bạn đã bị ban',
            ...ban[0]
        });
    }
    

    if (user.confirmed === 0)
        throw new BadRequest("Tài khoản của bạn chưa được xác minh!");

    let isCorrect = await compareHashString(password, user.password);
    delete user.password;
    delete user.confirmed;
    if (!isCorrect)
        throw new BadRequest("Email hoặc password sai!");
    await db.queryPlaceholdersAsync('UPDATE user SET lastLogin = CURRENT_TIMESTAMP() WHERE id = ?', [user.id]);
    await db.queryPlaceholdersAsync("UPDATE user_ban SET status = 'REMOVED' WHERE userID = ? AND status = 'ACTIVE'", [user.id]);
    res.send({
        ...user,
        token: signData(user)
    });
});