const { BadRequest } = require("../../helpers/response");
const { AsyncCatch } = require("../../helpers/utilities");
const {signData} = require('../../helpers/jwt');
const db = require('../../db');
module.exports = AsyncCatch(async (req, res, next) => {
    const token = req.query.token;
    
    if(!token) throw new BadRequest("Token required!");
    const result = await db.queryPlaceholdersAsync("SELECT id, name, email, avatar, role, money, username, (bannedTime > CURRENT_TIMESTAMP()) as isBanned, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE confirmToken = ? AND confirmed = 0", [token]);
    
    if(result.length == 0) throw new BadRequest("Wrong token!");
    const user = result[0];

    db.queryPlaceholdersAsync("UPDATE user SET confirmed = 1, confirmToken = NULL WHERE id = ?", [user.id]);
    res.send({
        ...user,
        token: signData(user)
    })
})