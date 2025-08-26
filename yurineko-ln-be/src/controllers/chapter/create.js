const { lightnovelService, chapterService } = require("../../services");
const makeNotification = require("../../services/notification.service");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
  const { lightnovelId, name } = req.body;

  const lightnovel = await lightnovelService.findById(lightnovelId, 'originalName, thumbnail');

  const owner = await lightnovelService.findTeamId(lightnovelId);

  if (req.userData.role !== 3 && owner !== req.userData.teamID) {
    throw new Forbidden("Bạn không có quyền để thực hiện!");
  }

  const chapterId = await chapterService.create(req.body);
  res.send({ chapterId });

  await makeNotification({
    type: "ln_new_chapter",
    title: `<strong>${lightnovel.originalName} - ${name}</strong>`,
    body: "Truyện bạn theo dõi đã có chapter mới, xem ngay!",
    objectId: chapterId,
    url: `https://ln.yurineko.net/read/${chapterId}`,
    thumbnail: `/${lightnovel.thumbnail}`,
    icon: 'follow-new-chapter'
  })
})
