const { reportService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    res.send(await reportService.get(req.userData.teamID, pagi));
})