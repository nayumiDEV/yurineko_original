const jwt = require("jsonwebtoken");
const { Unauthorized } = require("../utils/response");
const config = require("../config/config");
const db = require('../db');
const catchAsync = require("../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    let userData = {};
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) throw new Unauthorized("Error when decoding token");
      if (!decoded)
        throw new Unauthorized("Invalid token!");
      else
        userData = decoded;
    });
    const user = await db.queryPlaceholdersAsync("SELECT id, name, userName, avatar, email, role, teamID, (bannedTime > CURRENT_TIMESTAMP()) AS isBanned, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE id = ?", [userData.id]);
    if (user.length == 0) throw new Unauthorized("Tài khoản không tồn tại!");
    if (user[0].isBanned == true) throw new Unauthorized("Bạn đã bị ban!");
    else req.userData = user[0];
  }
  next();
});