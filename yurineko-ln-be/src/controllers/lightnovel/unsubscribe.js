const { BadRequest } = require("../../utils/response");
const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;
    const isLiked = await lightnovelService.checkSubscribedLightnovel(lightnovelId, req.userData.id);
    if (isLiked === false) {
        throw new BadRequest("Bạn chưa subscribe light novel này!");
    }

    await lightnovelService.unsubscribe(lightnovelId, req.userData.id);
    res.send("Success!");
})