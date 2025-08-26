const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnovelId } = req.params;
    await lightnovelService.findById(lightnovelId, "1");
    const userId = req.userData.id;
    await lightnovelService.removeFromList(lightnovelId, userId);
    res.send("Success!");
})