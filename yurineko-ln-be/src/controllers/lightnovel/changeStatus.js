const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const { Forbidden } = require("../../utils/response");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;
    const { status } = req.body;

    const lightnovelTeamId = await lightnovelService.findTeamId(lightnovelId);
    if (req.userData.role === 2 && req.userData.teamID !== lightnovelTeamId) {
        throw new Forbidden("Bạn không có quyền truy cập tính năng này!");
    }

    await lightnovelService.changeStatus(lightnovelId, status);

    res.send("Success!");
})