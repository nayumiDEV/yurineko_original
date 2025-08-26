const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const userId = req.userData ? req.userData.id : 0;
    res.send(await lightnovelService.r18RandomLightnovel(userId));
})