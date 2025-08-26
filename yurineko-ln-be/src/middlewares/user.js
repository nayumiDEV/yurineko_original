const { Unauthorized } = require("../utils/response");
const catchAsync = require("../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
    if(!req.userData)
        throw new Unauthorized("Bạn phải là thành viên để truy cập tài nguyên này!");
    else next();
})
