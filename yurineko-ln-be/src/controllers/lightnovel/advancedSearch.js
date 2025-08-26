const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const { genre, notGenre } = req.query;
    const pagi = pagination(req.query);
    const tag = genre ? genre.split(',') : [];
    const excludedTag = notGenre ? notGenre.split(',') : [];
    const data = await lightnovelService.advancedSearch(tag, excludedTag, req.userData?.id, req.query, pagi);
    res.send(data);
})