const { chapterService } = require("../../services");
const { Forbidden } = require('../../utils/response');
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const chapterTeamId = await chapterService.findTeamId(req.params.id);
    if (req.userData.role < 3 && req.userData.teamID !== chapterTeamId) {
        throw new Forbidden("Không đủ quyền để truy cập!")
    }

    const chapter = await chapterService.getInfoForEdit(req.params.id);

    res.send(chapter);
})