const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    const userId = req.userData.id;
    const data = await lightnovelService.getHistory(userId, pagi);
    res.send(data);
})