const { AsyncCatch } = require("../../helpers/utilities");
const db = require('../../db');
const { signData } = require("../../helpers/jwt");

module.exports = AsyncCatch(async (req, res, next) => {
    const result = await db.queryPlaceholdersAsync(
        "SELECT id, name, email, avatar, role, money, username, (bannedTime > CURRENT_TIMESTAMP()) as isBanned, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE id = ?", 
        [req.userData.id]);

    const user = result[0];

    res.send({
        ...user,
        token: signData(user)
    });
});