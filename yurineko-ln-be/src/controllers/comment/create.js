const catchAsync = require("../../utils/catchAsync");
const { BadRequest } = require('../../utils/response');
const { v4: uuidv4 } = require('uuid');
const { dir } = require("../../config/config");
const { imageService, commentService, lightnovelService, chapterService } = require("../../services");
const makeNotification = require("../../services/notification.service");
const link = require("../../utils/link");

// create comment
module.exports = catchAsync(async (req, res) => {
  const { content, lightnovelID, chapterID, replyID } = req.body;

  if (!req.file && (!content || content.length === 0)) {
    throw new BadRequest("Comment phải có ảnh hoăc nội dung!");
  }
  let path = null;

  if (req.file) {
    path = `ln_comment/${uuidv4()}.jpeg`;
    const realPath = `${dir.storage}/${path}`;
    await imageService.compress(req.file.buffer, realPath);
  }

  const commentId = await commentService.create(req, path);

  const data = await commentService.findByIdNewComment(commentId);

  res.send(data);

  const ln = await lightnovelService.getLightnovelInfoForNotif(lightnovelID);
  let name = ln.originalName;

  if (chapterID != 0) {
    name = `${ln.originalName} - ${await chapterService.getChapterName(chapterID)}`;
  }

  const url = link(lightnovelID, chapterID);

  if (replyID != 0) {
    await makeNotification({
      type: "ln_comment_reply",
      title: `<strong>${req.userData.name}</strong>$ đã trả lời bình luận của bạn trong <strong>${name}</strong>`,
      body: content.slice(0, 180),
      url,
      objectId: replyID,
      senderId: req.userData.id,
      thumbnail: req.userData.avatar,
      icon: "comment",
      push: true
    });

    await makeNotification({
      type: "ln_comment_reply_following",
      title: `<strong>${req.userData.name}</strong>$ đã trả lời một bình luận mà bạn đang theo dõi trong <strong>${name}</strong>`,
      body: content.slice(0, 180),
      url,
      objectId: replyID,
      senderId: req.userData.id,
      thumbnail: req.userData.avatar,
      icon: "comment",
      push: true
    })
  }

  const teamId = await lightnovelService.getLightnovelTeamInfo(lightnovelID);
  if (teamId != req.userData.teamID) {
    await makeNotification({
      type: "ln_comment_team",
      title: `<strong>${req.userData.name}</strong>$ đã bình luận về truyện <strong>${name}</strong>`,
      body: content.slice(0, 180),
      url,
      objectId: lightnovelID,
      senderId: req.userData.id,
      thumbnail: req.userData.avatar,
      icon: "comment",
      push: true
    })
  }
})
