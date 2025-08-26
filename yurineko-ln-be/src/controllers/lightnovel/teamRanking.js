const {
  lightnovelService
} = require("../../services");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
  const userId = req.userData ? req.userData.id : 0;
  const {
    type
  } = req.query;
  const {
    id
  } = req.params;
  switch (type) {
    case 'view':
      const data = {};
      data.day = await lightnovelService.rankTeamLightnovelBy(id, "dailyView", userId);
      data.week = await lightnovelService.rankTeamLightnovelBy(id, "weeklyView", userId);
      data.month = await lightnovelService.rankTeamLightnovelBy(id, "monthlyView", userId);
      data.total = await lightnovelService.rankTeamLightnovelBy(id, "totalView", userId);
      res.send(data);
      break;
    case 'list':
      res.send(await lightnovelService.rankTeamLightnovelBy(id, "totalFollow", userId));
      break;
    case 'like':
      res.send(await lightnovelService.rankTeamLightnovelBy(id, "likeCount", userId));
      break;
  }
})
