const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const pagination = require("../../utils/pagination");

module.exports = catchAsync(async (req, res) => {
    const {type} = req.query;
    const pagi = pagination(req.query);
    const data = await lightnovelService.getListLightnovel(req.userData.id, type, pagi);
    res.send(data);
})