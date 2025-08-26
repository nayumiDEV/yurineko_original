const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    
    const result = await lightnovelService.getMyTeamLightnovel(req.userData.teamID, req.query.query, pagi);

    res.send(result);
})