const { queryPlaceholdersAsync } = require("../db");

const getChapterReactionInfo = async (chapterId) => queryPlaceholdersAsync("SELECT type, reactionCount FROM chapter_reaction_count WHERE chapterID = ?", [chapterId])

module.exports = {
  getChapterReactionInfo
}