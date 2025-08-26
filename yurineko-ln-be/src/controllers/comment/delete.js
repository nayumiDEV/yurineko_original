const { commentService } = require("../../services");
const catchAsync = require("../../utils/catchAsync");
const {Forbiden} = require('../../utils/response');

module.exports = catchAsync(async (req, res) => {
    const {id: commentId} = req.params;
    
    const commentTeamId = await commentService.findTeamComment(commentId);

    if(req.userData.role === 2 && req.userData.teamID !== commentTeamId){
        throw new Forbiden("Bạn không có quyền truy cập tính năng này!");
    }

    await commentService.delete(commentId);

    res.send("Success!");
})