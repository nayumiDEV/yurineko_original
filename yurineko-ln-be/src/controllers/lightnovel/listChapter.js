const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: lightnoveId } = req.params;
    await lightnovelService.findById(lightnoveId, '1');
    const chapters = await lightnovelService.listChapter(lightnoveId);
    res.send(chapters);
})