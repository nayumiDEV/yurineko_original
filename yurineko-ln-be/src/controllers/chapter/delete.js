const { chapterService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

// delete chapter
module.exports = catchAsync(async (req, res) => {
    const { id: chapterId } = req.params;

    const owner = await chapterService.findTeamId(chapterId);

    if (req.userData.role !== 3 && owner !== req.userData.teamID) {
        throw new Forbidden("Bạn không có quyền để thực hiện!");
    }

    await chapterService.delete(chapterId);
    res.send("Success!");
})