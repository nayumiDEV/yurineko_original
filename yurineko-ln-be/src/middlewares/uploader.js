const catchAsync = require("../utils/catchAsync");
const { Unauthorized } = require("../utils/response");

module.exports = catchAsync(async (req, res, next) => {
    if(!req.userData || req.userData.role < 2)
        throw new Unauthorized("Permission denied!");
    else next();
})