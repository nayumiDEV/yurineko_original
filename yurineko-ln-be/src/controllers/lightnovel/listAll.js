const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    const data = await lightnovelService.getAllLightnovel(req.query.query, pagi);
    res.send(data);
})