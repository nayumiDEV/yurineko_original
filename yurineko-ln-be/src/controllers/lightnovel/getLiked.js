const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    const data = await lightnovelService.getLikedLightnovel(req.userData.id, pagi);
    res.send(data);
})