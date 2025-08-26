const { chapterService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const {id: chapterId} = req.params;
    await chapterService.unlike(chapterId, req.userData.id);
    res.send("Success!");
})