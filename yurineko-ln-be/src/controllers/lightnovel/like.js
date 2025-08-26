const { BadRequest } = require("../../utils/response");
const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;
    const isLiked = await lightnovelService.checkLikedLightnovel(lightnovelId, req.userData.id);
    if (isLiked === true) {
        throw new BadRequest("Bạn đã like light novel này!");
    }

    await lightnovelService.like(lightnovelId, req.userData.id);
    res.send("Success!");
})