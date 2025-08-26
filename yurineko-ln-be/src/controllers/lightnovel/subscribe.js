const { BadRequest } = require("../../utils/response");
const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;
    const isLiked = await lightnovelService.checkSubscribedLightnovel(lightnovelId, req.userData.id);
    if (isLiked === true) {
        throw new BadRequest("Bạn đã subscribe light novel này!");
    }

    await lightnovelService.subscribe(lightnovelId, req.userData.id);
    res.send("Success!");
})