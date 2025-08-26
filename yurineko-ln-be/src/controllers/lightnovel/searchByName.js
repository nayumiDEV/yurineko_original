const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const pagi = pagination(req.query);
    const { query } = req.query;
    const data = await lightnovelService.searchByName(query, req.userData ? req.userData.id : 0, pagi);
    res.send(data);
})