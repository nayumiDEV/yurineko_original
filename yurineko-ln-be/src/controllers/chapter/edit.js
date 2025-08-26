const { queryPlaceholdersAsync } = require("../../db");
const { chapterService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

// edit chapter
module.exports = catchAsync(async (req, res) => {
    const {id: chapterId} = req.params;
    
    const owner = await chapterService.findTeamId(chapterId);

    if (req.userData.role !== 3 && owner !== req.userData.teamID) {
        throw new Forbidden("Bạn không có quyền để thực hiện!");
    }
    
    await chapterService.edit(chapterId, req.body);

    res.send("Success!");
})