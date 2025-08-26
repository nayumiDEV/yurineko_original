const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    res.send(await lightnovelService.getDirectoryGeneral());
})