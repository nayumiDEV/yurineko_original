const catchAsync = require("../../utils/catchAsync");
const { lightnovelService } = require("../../services");
const { removeFiles } = require("../../services/temp.service");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;

    const lightnovel =  await lightnovelService.findById(lightnovelId, 'thumbnail');

    const owner = await lightnovelService.findTeamId(lightnovelId);

    if (req.userData.role !== 3 && owner !== req.userData.teamID) {
        throw new Forbidden("Bạn không có quyền để thực hiện!");
    }

    await lightnovelService.delete(lightnovelId);

    removeFiles([lightnovel.thumbnail]);

    res.send("Success!");
})