const { chapterService, lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: chapterId } = req.params;
    const data = await chapterService.getReadInfo(chapterId);
    if (req.userData) {
        chapterService.setHistory(data.lightnovelInfo.id, data.chapterInfo.id, req.userData.id);
        data.chapterInfo.userData = await chapterService.getUserData(chapterId, req.userData);
        data.lightnovelInfo.userData = await lightnovelService.getUserData(data.lightnovelInfo.id, req.userData);
    }
    res.send(data);
    chapterService.incView(chapterId);
    console.log(data.lightnovelInfo.id);
    lightnovelService.incView(data.lightnovelInfo.id);
})