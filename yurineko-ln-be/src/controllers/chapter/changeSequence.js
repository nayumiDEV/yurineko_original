const { chapterService, lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const { BadRequest } = require("../../utils/response");

module.exports = catchAsync(async (req, res) => {
    const { id: chapterId } = req.params;
    const { sequence } = req.body;
    const chapter = await chapterService.findById(chapterId, "lnID, sequence");
    // if (sequence === chapter.sequence) {
    //     throw new BadRequest("Thứ tự không được trùng với thứ tự hiện tại!");
    // }
    await chapterService.changeSequence(chapterId, sequence, chapter.lnID);
    res.send(await lightnovelService.listChapter(chapter.lnID));
})