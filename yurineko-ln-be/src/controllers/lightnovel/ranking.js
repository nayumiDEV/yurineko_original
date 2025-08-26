const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const userId = req.userData ? req.userData.id : 0;
    const { type } = req.query;
    switch (type) {
        case 'view':
            const data = {};
            data.day = await lightnovelService.rankLightnovelBy("dailyView", userId);
            data.week = await lightnovelService.rankLightnovelBy("weeklyView", userId);
            data.month = await lightnovelService.rankLightnovelBy("monthlyView", userId);
            data.total = await lightnovelService.rankLightnovelBy("totalView", userId);
            res.send(data);
            break;
        case 'list':
            res.send(await lightnovelService.rankLightnovelBy("totalFollow", userId));
            break;
        case 'like':
            res.send(await lightnovelService.rankLightnovelBy("likeCount", userId));
            break;
    }
})