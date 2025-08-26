const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;

    const lightnovel = await lightnovelService.getInfoLightnovel(lightnovelId, req.userData ?? null);

    res.send(lightnovel);
})
