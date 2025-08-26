const { queryPlaceholdersAsync } = require("../../db");
const { lightnovelService, tempService, teamService } = require("../../services");
const makeNotification = require("../../services/notification.service");
const catchAsync = require("../../utils/catchAsync");
const { BadRequest } = require('../../utils/response');


module.exports = catchAsync(async (req, res) => {
  const { thumbnail, originalName } = req.body;

  const thumbnailCheck = await tempService.countTemp([thumbnail]);
  if (thumbnailCheck !== 1) {
    throw new BadRequest("Thumbnail không hợp lệ!");
  }

  const lightnovelId = await lightnovelService.create(req.userData.teamID, req.body);

  res.send({
    lightnovelId
  });

  const team = await teamService.findById(req.userData.teamID, "name");
  makeNotification({
    type: "ln_publish",
    title: `<strong>${team.name} - ${originalName}</strong>`,
    body: "Nhóm dịch bạn đang theo dõi vừa đăng truyện mới! Xem ngay!",
    url: `https://ln.yurineko.net/novel/${mangaID}`,
    objectId: lightnovelId,
    thumbnail: `/${path}`,
    icon: "follow-new-manga"
  })
})
