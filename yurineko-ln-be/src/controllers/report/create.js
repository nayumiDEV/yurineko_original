const { reportService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    await reportService.create(req.body);
    res.send("Success!");
})