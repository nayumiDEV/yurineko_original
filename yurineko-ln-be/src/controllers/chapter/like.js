const { chapterService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const {id: chapterId} = req.params;
    await chapterService.like(chapterId, req.userData.id);
    res.send("Success!");
})