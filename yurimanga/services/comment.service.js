const { queryPlaceholdersAsync } = require("../db");

const getCommentReactionInfo = async (commentId) => queryPlaceholdersAsync("SELECT type, reactionCount FROM comment_reaction_count WHERE commentID = ?", [commentId])

const checkCommentRights = async (commentId, userData) => {
  if (userData.role < 2) {
    return false;
  }

  if (userData.role == 3) {
    return true;
  }

  const commentData = await queryPlaceholdersAsync(
    "SELECT m.teamID FROM comment c JOIN manga_team m ON c.mangaID = m.mangaID WHERE c.id = ? LIMIT 1",
    [commentId]);

  if (commentData.length != 0 && commentData[0].teamID == userData.teamID) {
    return true;
  }

  return false;
}

module.exports = {
  getCommentReactionInfo,
  checkCommentRights
}