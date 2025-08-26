const { Unauthorized } = require("../utils/response");
const catchAsync = require("../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
    if(!req.userData || req.userData.isPremium === true)
        throw new Unauthorized("Permission denied!");
    else next();
})