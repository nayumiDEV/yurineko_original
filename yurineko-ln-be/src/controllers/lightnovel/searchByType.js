const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    const result = await lightnovelService.getLightnovelByType(req.query, pagi, req.userData? req.userData.id : 0);
    res.send(result);
})