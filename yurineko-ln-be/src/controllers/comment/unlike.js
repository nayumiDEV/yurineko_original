const { commentService } = require("../../services");
const { BadRequest } = require("../../utils/response");
const catchAsync = require("../../utils/catchAsync");

module.exports = catchAsync(async (req, res) => {
    const { id: commentId } = req.params;
    if (await commentService.checkLikedComment(req.userData.id, commentId) === false) {
        throw new BadRequest("Bạn chưa like comment!");
    }
    await commentService.unlike(req.userData.id, commentId);
    res.send("Success!");
})