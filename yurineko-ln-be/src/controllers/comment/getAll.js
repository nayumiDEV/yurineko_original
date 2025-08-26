const { commentService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    if (req.userData.role === 3) {
        res.send(await commentService.getAllComment(pagi));
    } else {
        res.send(await commentService.getTeamComment(req.userData.teamID, pagi))
    }
})