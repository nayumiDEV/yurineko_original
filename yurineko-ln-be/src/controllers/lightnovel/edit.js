const { BadRequest, Forbidden } = require("../../utils/response");
const catchAsync = require("../../utils/catchAsync");
const { lightnovelService, tempService } = require("../../services");

module.exports = catchAsync(async (req, res, next) => {
    const { id: lightnovelId } = req.params;

    const lightnovel = await lightnovelService.findById(lightnovelId, 'thumbnail');

    const owner = await lightnovelService.findTeamId(lightnovelId);

    if (req.userData.role !== 3 && owner !== req.userData.teamID) {
        throw new Forbidden("Bạn không có quyền để thực hiện!");
    }


    if (req.body.thumbnail) {
        const { thumbnail } = req.body;

        if (lightnovel.thumbnail !== thumbnail) {
            const thumbnailCheck = await tempService.countTemp([thumbnail]);
            if (thumbnailCheck !== 1) {
                throw new BadRequest("Thumbnail không hợp lệ!");
            }
            await tempService.removeTemp([thumbnail]);
        }
    }

    await lightnovelService.edit(lightnovelId, req.body);

    res.send("Success!");
})