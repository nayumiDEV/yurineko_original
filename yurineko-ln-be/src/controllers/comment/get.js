const { commentService, lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    const { lightnovelID, chapterID } = req.query;
    const data = await commentService.get(req?.userData?.id, lightnovelID, chapterID, pagi);
    data.deleteAble = false;
    if (req.userData) {
        const teamID = await lightnovelService.findTeamId(lightnovelID);
        if (req.userData.role === 3 || (req.userData.teamID === teamID)) {
            data.deleteAble = true;
        }
    }

    res.send(data);
})
