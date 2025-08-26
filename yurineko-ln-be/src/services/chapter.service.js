const { queryPlaceholdersAsync } = require("../db");
const extractImageFromContent = require("../utils/extractImageFromContent");
const { BadRequest, NotFound } = require("../utils/response");
const { removeTemp, removeFiles } = require("./temp.service");
const stringify = require('json-stringify-safe');
const Lightnovel = require("../class/lightnovel");
const { lightnovelService } = require(".");

/**
 * Find chapter info with provided id
 * Throw BadRequest when found nothing!
 * @param {Number} chapterId
 * @param {String} selector Choose field to select, default *
 * @returns {Promise<Object>}
 */
const findById = async (chapterId, selector = '*') => {
  const chapter = await queryPlaceholdersAsync(
    `SELECT ${selector} FROM lchapter WHERE id = ? LIMIT 1`,
    [chapterId]
  );

  if (chapter.length === 0) {
    throw new BadRequest("Chapter id không hợp lệ!");
  }

  return chapter[0];
}

const findTeamId = async (chapterId) => {
  const team = await queryPlaceholdersAsync(
    "SELECT teamID FROM ln_team lt JOIN lchapter lc ON lt.lnID = lc.lnID WHERE lc.id = ? LIMIT 1",
    [chapterId]
  );

  if (team.length === 0) {
    throw new BadRequest('Team id chapter không hợp lệ!');
  }

  return team[0].teamID;
}

const createChapter = async ({ name, content, lightnovelId, publish }) => {
  const files = extractImageFromContent(content);
  await removeTemp(files);

  const stringifiedContent = stringify(content);
  const newChapter = await queryPlaceholdersAsync(
    "SELECT ADD_LN_CHAPTER( ?, ?, ?, ? ) AS chapterId",
    [name, stringifiedContent, lightnovelId, publish]
  );

  if (publish === 1) {
    await queryPlaceholdersAsync(
      "UPDATE ln SET totalChapter = totalChapter + 1, lastUpdate = CURRENT_TIMESTAMP() WHERE id = ?",
      [lightnovelId]
    );
  }

  return newChapter[0].chapterId;
}

const editChapter = async (chapterId, { name, content, publish }) => {
  const chapter = await findById(chapterId, 'name, content, lnID, publish');

  // process image logic @_@
  const newFiles = extractImageFromContent(content);
  const oldFiles = extractImageFromContent(JSON.parse(chapter.content));
  const filesToDelete = oldFiles.filter(e => !newFiles.includes(e));
  const filesToStore = newFiles.filter(e => !oldFiles.includes(e));

  // remove unsused file & temp flag of new file!
  removeFiles(filesToDelete);
  await removeTemp(filesToStore);

  const stringifiedContent = stringify(content);
  await queryPlaceholdersAsync(
    "UPDATE lchapter SET name = ?, content = ?, publish = ?, updateAt = CURRENT_TIMESTAMP() WHERE id = ?",
    [name, stringifiedContent, publish, chapterId]
  );

  if (chapter.publish === 0 && publish === 1) {
    await queryPlaceholdersAsync(
      "UPDATE ln SET totalChapter = totalChapter + 1, lastUpdate = CURRENT_TIMESTAMP() WHERE id = ?",
      [chapter.lnID]
    );
  }
  else if (chapter.publish === 1 && publish === 0) {
    await queryPlaceholdersAsync(
      "UPDATE ln SET totalChapter = totalChapter - 1 WHERE id = ?",
      [chapter.lnID]
    );
  }
}

const deleteChapter = async (chapterId) => {
  const chapter = await findById(chapterId, 'sequence, lnID, content');


  const files = extractImageFromContent(chapter.content);
  removeFiles(files);

  await queryPlaceholdersAsync(
    "DELETE FROM lchapter WHERE id = ?",
    [chapterId]
  );

  await queryPlaceholdersAsync(
    "UPDATE lchapter SET sequence = sequence - 1 WHERE lnID = ? AND sequence > ?",
    [chapter.lnID, chapter.sequence]
  )

  await queryPlaceholdersAsync(
    "UPDATE ln SET totalChapter = totalChapter - 1 WHERE id = ?",
    [chapter.lnID]
  );
}

const getChapterName = async (chapterId) => {
  const chapter = await queryPlaceholdersAsync(
    "SELECT name FROM lchapter WHERE id = ? LIMIT 1", [chapterId]
  );
  return chapter.length !== 0 ? chapter[0].name : null;
}

const getInfoForEdit = async (chapterId) => {
  const chapter = await queryPlaceholdersAsync(
    "SELECT lc.*, ln.originalName FROM lchapter lc JOIN ln ON ln.id = lc.lnID WHERE lc.id = ? LIMIT 1",
    [chapterId]
  );

  if (chapter.length === 0) {
    return new NotFound("Không tìm thấy chapter!");
  }

  return chapter[0];
}

const getChapterUserData = async (chapterId, { id: userId }) => {
  const like = await queryPlaceholdersAsync(
    "SELECT EXISTS (SELECT 1 FROM lchapter_like WHERE userID = ? AND chapterID = ? LIMIT 1) AS isLiked",
    [userId, chapterId]
  )

  return {
    like: like[0].isLiked
  }
}

const setHistory = async (lightnovelId, chapterId, userId) => {
  await queryPlaceholdersAsync(
    "CALL SET_HISTORY_LN( ?, ?, ? )",
    [lightnovelId, chapterId, userId]
  );
}

const incView = async (chapterId) => {
  await queryPlaceholdersAsync(
    "UPDATE lchapter SET view = view + 1 WHERE id = ?",
    [chapterId]
  );
}

const getReadInfo = async (chapterId) => {
  const chapterInfo = await findById(chapterId, "id, name, lnID, content, updateAt, view, likeCount");
  const LN = new Lightnovel(chapterInfo.lnID);
  const listChapter = await LN.minListChapter();
  const lightnovelInfo = await lightnovelService.findById(chapterInfo.lnID, "id, originalName");
  lightnovelInfo.teamID = await lightnovelService.findTeamId(lightnovelInfo.id);
  delete chapterInfo.lnID;

  return {
    chapterInfo,
    lightnovelInfo,
    listChapter
  }
}

const likeChapter = async (chapterId, userId) => {
  await queryPlaceholdersAsync(
    "INSERT INTO lchapter_like(chapterId, userId) VALUES(?, ?)",
    [chapterId, userId]
  );

  await queryPlaceholdersAsync(
    "UPDATE lchapter SET likeCount = likeCount + 1 WHERE id = ?",
    [chapterId]
  )
}

const unlikeChapter = async (chapterId, userId) => {
  await queryPlaceholdersAsync(
    "DELETE FROM lchapter_like WHERE chapterID = ? AND userID = ?",
    [chapterId, userId]
  );

  await queryPlaceholdersAsync(
    "UPDATE lchapter SET likeCount = likeCount - 1 WHERE id = ?",
    [chapterId]
  )
}

const changeSequence = async (chapterId, sequence, lightnovelId) => {
  const countChapter = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS chapterCount FROM lchapter WHERE lnID = ?",
    [lightnovelId]
  );

  if (sequence > countChapter[0].chapterCount) {
    throw new BadRequest("Thứ tự chapter không hợp lệ!");
  }

  await queryPlaceholdersAsync(
    "CALL CHANGE_SEQ_LCHAPTER( ? , ? )",
    [chapterId, sequence]
  );
}

module.exports = {
  findById,
  findTeamId,
  create: createChapter,
  edit: editChapter,
  delete: deleteChapter,
  getInfoForEdit,
  getReadInfo,
  getUserData: getChapterUserData,
  setHistory,
  incView,
  like: likeChapter,
  unlike: unlikeChapter,
  changeSequence,
  getChapterName
}
