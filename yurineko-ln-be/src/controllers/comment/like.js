const { commentService } = require("../../services");
const { BadRequest } = require("../../utils/response");
const catchAsync = require("../../utils/catchAsync");
const link = require("../../utils/link");
const makeNotification = require("../../services/notification.service");

module.exports = catchAsync(async (req, res) => {
  const { id: commentId } = req.params;
  if (await commentService.checkLikedComment(req.userData.id, commentId) === true) {
    throw new BadRequest("Bạn đã like comment!");
  }
  await commentService.like(req.userData.id, commentId);
  res.send("Success!");

  const commentData = await commentService.getCommentData(commentId);
  const url = link(commentData.lnID, commentData.chapterID);
  let name = commentData.originalName;
  if (commentData.chapterID !== 0) {
    name = `${commentData.originalName} - ${commentData.name}`
  };

  if (commentData.userID != req.userData.id) {
    await makeNotification({
      type: "manga_comment_like",
      title: `<strong>${req.userData.name}</strong>$ đã thích bình luận của bạn trong <strong>${name}</strong>`,
      body: commentData.content.slice(0, 180),
      url,
      objectId: commentId,
      senderId: req.userData.id,
      thumbnail: req.userData.avatar,
      icon: 'reaction-heart',
      push: false
    })
  }
})
