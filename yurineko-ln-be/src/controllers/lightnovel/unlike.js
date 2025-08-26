const { BadRequest } = require("../../utils/response");
const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;
    const isLiked = await lightnovelService.checkLikedLightnovel(lightnovelId, req.userData.id);
    if (isLiked === false) {
        throw new BadRequest("Bạn chưa like light novel này!");
    }

    await lightnovelService.unlike(lightnovelId, req.userData.id);
    res.send("Success!");
})