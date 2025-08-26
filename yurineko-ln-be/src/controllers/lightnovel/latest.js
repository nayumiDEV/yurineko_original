const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);

    const result = await lightnovelService.latestLightnovel(req.userData ? req.userData.id : 0, pagi);

    res.send(result);
})