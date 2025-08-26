const { lightnovelService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const userId = req.userData ? req.userData.id : 0;
    const { type } = req.query;
    switch (type) {
        case 'view':
            const data = {};
            data.day = await lightnovelService.r18RankLightnovelBy("dailyView", userId);
            data.week = await lightnovelService.r18RankLightnovelBy("weeklyView", userId);
            data.month = await lightnovelService.r18RankLightnovelBy("monthlyView", userId);
            data.total = await lightnovelService.r18RankLightnovelBy("totalView", userId);
            res.send(data);
            break;
        case 'list':
            res.send(await lightnovelService.r18RankLightnovelBy("totalFollow", userId));
            break;
        case 'like':
            res.send(await lightnovelService.r18RankLightnovelBy("likeCount", userId));
            break;
    }
})