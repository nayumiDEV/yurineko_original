const { Unauthorized } = require("../helpers/response");
const { AsyncCatch } = require("../helpers/utilities");

module.exports = AsyncCatch(async (req, res, next) => {
    if(!req.userData || req.userData.role < 2)
        throw new Unauthorized("Permission denied!");
    else next();
})