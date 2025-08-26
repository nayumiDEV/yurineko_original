const { BadRequest } = require("http-errors");
const { tempService } = require(".");
const config = require("../config/config");
const { host } = require("../config/config");
const { queryPlaceholdersAsync } = require("../db")

const findByIdNewComment = async (commentId) => {
  const result = await queryPlaceholdersAsync(
    "SELECT c.id, c.content, c.image, c.replyID, likeCount, c.createAt, userID, u.name, u.role, u.username, u.avatar, (u.premiumTime > CURRENT_TIMESTAMP()) isPremium, t.id teamID, t.name teamName, t.url FROM lcomment c JOIN user u ON c.userID = u.id JOIN team t ON u.teamID = t.id WHERE c.id = ? LIMIT 1",
    [commentId]
  );
  const data = result[0];
  if (data.image != null)
    data.image = `${host.storage}/${data.image}`;
  data.avatar = `${host.storage}/${data.avatar}`;
  data.liked = 0;

  return data;
}

const findTeamComment = async (commentId) => {
  const team = await queryPlaceholdersAsync(
    "SELECT teamID FROM lcomment c JOIN ln_team lt ON lt.lnID = c.lnID WHERE c.id = ? LIMIT 1",
    [commentId]
  );

  if (team.length === 0) {
    throw new BadRequest("Comment không hợp lệ!");
  }

  return team[0].teamID;
}

const createComment = async (req, path = null) => {
  const { content, lightnovelID, chapterID, replyID } = req.body;
  const newComment = await queryPlaceholdersAsync(
    "INSERT INTO lcomment (userID, lnID, chapterID, replyID, content, image) VALUES (?, ?, ?, ?, ?, ?)",
    [req.userData.id, lightnovelID, chapterID, replyID, content, path]
  )

  return newComment.insertId;
}

const deleteComment = async (commentId) => {
  const comment = await queryPlaceholdersAsync(
    "SELECT image FROM lcomment WHERE id = ?",
    [commentId]
  );

  if (comment[0].image !== null) {
    tempService.removeFiles([comment[0].image]);
  }

  await queryPlaceholdersAsync(
    "DELETE FROM lcomment WHERE id = ?",
    [commentId]
  );
}

const getComment = async (userId, lightnovelId, chapterId, { skip, limit }) => {
  const prod = await queryPlaceholdersAsync(
    "CALL GET_COMMENT_LN( ?, ?, ?, ?)",
    [lightnovelId, chapterId, skip, limit]
  );
  const result = prod[0];
  // const result = [];
  // for (let i = 0; i < comment.length; ++i) {
  //     if (comment[i].replyID !== 0) {
  //         break;
  //     }
  //     const elem = comment[i];
  //     elem.replies = [];
  //     for (let j = comment.length - 1; j >= 0; --j) {
  //         if (comment[j].replyID === 0) {
  //             break;
  //         }
  //         if (comment[j].replyID === elem.id) {
  //             elem.replies.push(comment[j]);
  //         }
  //     };
  //     result.push(elem);
  // }

  Promise.all(result.map(async (e) => {
    if (e.image !== null) {
      e.image = `${config.host.storage}/${e.image}`
    }
    e.avatar = `${config.host.storage}/${e.avatar}`
    e.liked = 0;
    if (userId) {
      const like = await queryPlaceholdersAsync("SELECT (EXISTS (SELECT 1 FROM lcomment_like WHERE userID = ? AND commentID = ?)) as liked", [userId, e.id]);
      e.liked = like[0].liked;
    }
  }))

  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM lcomment WHERE lnID = ? AND chapterID = ? AND replyID = 0",
    [lightnovelId, chapterId]
  )

  return {
    result,
    resultCount: resultCount[0].resultCount
  }
}

const getCommentData = async (commentId) => {
  const comment = await queryPlaceholdersAsync(
    "SELECT c.*, l.originalName, cc.name FROM lcomment c JOIN ln l ON c.lnID = l.id LEFT JOIN lchapter cc ON c.chapterID = cc.id WHERE c.id = ? LIMIT 1",
    [commentId]
  );
  return comment[0];
}

const checkLikedComment = async (userId, commentId) => {
  const comment = await queryPlaceholdersAsync(
    "SELECT 1 FROM lcomment_like WHERE userID = ? AND commentID = ? LIMIT 1",
    [userId, commentId]
  );

  return comment.length === 1;
}

const likeComment = async (userId, commentId) => {
  await queryPlaceholdersAsync(
    "INSERT INTO lcomment_like(userID, commentID) VALUES(?, ?)",
    [userId, commentId]
  );

  await queryPlaceholdersAsync(
    "UPDATE lcomment SET likeCount = likeCount + 1 WHERE id = ?",
    [commentId]
  );
}

const unlikeComment = async (userId, commentId) => {
  await queryPlaceholdersAsync(
    "DELETE FROM lcomment_like WHERE userID = ? AND commentID = ?",
    [userId, commentId]
  );
  await queryPlaceholdersAsync(
    "UPDATE lcomment SET likeCount = likeCount - 1 WHERE id = ?",
    [commentId]
  );
}

const getAllComment = async ({ skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT u.name, u.avatar, c.id, c.lnID, c.chapterID, c.content, c.image, c.replyID, c.createAt, ln.originalName FROM lcomment c JOIN user u ON u.id = c.userID JOIN ln ON ln.id = c.lnID ORDER BY c.createAt DESC LIMIT ?, ?",
    [skip, limit]
  );

  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM lcomment",
  )

  return {
    result,
    resultCount: resultCount[0].resultCount
  }
}

const getTeamComment = async (teamId, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT u.name, u.avatar, c.id, c.lnID, c.chapterID, c.content, c.image, c.replyID, c.createAt, ln.originalName FROM lcomment c JOIN user u ON u.id = c.userID JOIN ln ON ln.id = c.lnID JOIN ln_team lt ON lt.lnID = c.lnID WHERE lt.teamID = ? ORDER BY c.createAt DESC LIMIT ?, ?",
    [teamId, skip, limit]
  )

  result.map(e => e.image = `${config.host.storage}/${e.image}`);

  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM lcomment c JOIN ln_team lt ON c.lnID = lt.lnID WHERE lt.teamID = ?",
    [teamId]
  );

  return {
    result,
    resultCount: resultCount[0].resultCount
  }
}

module.exports = {
  findByIdNewComment,
  findTeamComment,
  create: createComment,
  delete: deleteComment,
  get: getComment,
  like: likeComment,
  unlike: unlikeComment,
  checkLikedComment,
  getAllComment,
  getTeamComment,
  getCommentData
}
