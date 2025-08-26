const { queryPlaceholdersAsync } = require("../db");
const { removeTemp, removeFiles } = require("./temp.service");
const { BadRequest, NotFound } = require('../utils/response');
const config = require("../config/config");
const Lightnovel = require("../class/lightnovel");
const extractImageFromContent = require("../utils/extractImageFromContent");
const isNumeric = require("../utils/isNumeric");

const insertTags = async (tag = [], lightnovelId, type) => {
  if (tag.length !== 0) {
    // like above
    const tagToInsert = tag.map(id => [id, lightnovelId]);
    await queryPlaceholdersAsync(
      `INSERT INTO ln_${type} VALUES ?`,
      [tagToInsert]
    )
  }
}

const editTags = async (tag, lightnovelId, type) => {
  if (tag !== null) {
    await removeTags(lightnovelId, type);
    insertTags(tag, lightnovelId, type);
  }
}

const removeTags = async (lightnovelId, type) => {
  await queryPlaceholdersAsync(
    `DELETE FROM ln_${type} WHERE lnID = ?`,
    [lightnovelId]
  );
}

/**
 * Find the info of a lightnovel
 * @param {Number} lightnovelId
 * @param {String} selector
 * @returns {Promise<>} Lightnovel full info
 */
const findById = async (lightnovelId, selector = '*') => {
  const lightnovel = await queryPlaceholdersAsync(
    `SELECT ${selector} FROM ln WHERE id = ?`,
    [lightnovelId]
  );

  if (lightnovel.length === 0) {
    throw new BadRequest("Lightnovel không hợp lệ!");
  }

  return lightnovel[0];
}

/**
 * Find teamID of the lightnovel
 * @param {Number} lightnovelId
 * @returns {Promise<Number>} teamID of the team own the lightnovel
 */
const findTeamId = async (lightnovelId) => {
  const team = await queryPlaceholdersAsync(
    "SELECT teamID FROM ln_team WHERE lnID = ? LIMIT 1",
    [lightnovelId]
  );
  if (team.length === 0) {
    throw new BadRequest("Team lightnovel không hợp lệ!");
  }

  return team[0].teamID;
}

/**
 * Create a new lightnovel with data
 * @param {Number} teamID
 * @param {Object} data
 */
const createLightnovel = async (teamID, { originalName, otherName, description, type, thumbnail, tag, couple, origin, author }) => {
  const insertLightnovelOperator = await queryPlaceholdersAsync(
    "INSERT INTO ln (originalName, otherName, description, type, thumbnail) VALUES(?, ?, ?, ?, ?)",
    [originalName, otherName, description, type, thumbnail]
  );

  const lightnovelId = insertLightnovelOperator.insertId;

  await queryPlaceholdersAsync(
    "INSERT INTO ln_team VALUES (?, ?)",
    [lightnovelId, teamID]
  )

  await removeTemp([thumbnail]);

  await insertTags(tag, lightnovelId, "tag");
  await insertTags(author, lightnovelId, "author");

  // doujinshi?
  if (type === 2) {
    await insertTags(origin, lightnovelId, "origin");
    await insertTags(couple, lightnovelId, "couple");
  }

  return lightnovelId;
}

/**
 * Edit lightnovel with new data
 * @param {Number} lightnovelId
 * @param {Object} data
 */

const updateLightnovel = async (lightnovelId, { originalName, otherName, description, type, thumbnail, tag, couple, origin, author }) => {
  const oldData = await findById(lightnovelId, "originalName, otherName, description, type, thumbnail");

  originalName = originalName ?? oldData.originalName;
  otherName = otherName ?? oldData.otherName;
  description = description ?? oldData.description;
  type = type ?? oldData.type;
  thumbnail = thumbnail ?? oldData.thumbnail;

  await queryPlaceholdersAsync(
    "UPDATE ln SET originalName = ?, otherName = ?, description = ?, type = ?, thumbnail = ? WHERE id = ?",
    [originalName, otherName, description, type, thumbnail, lightnovelId]
  );

  await editTags(tag, lightnovelId, "tag");
  await editTags(author, lightnovelId, "author");

  // doujinshi?
  if (type === 2) {
    await editTags(origin, lightnovelId, "origin");
    await editTags(couple, lightnovelId, "couple");
  }
  else {
    await removeTags(lightnovelId, "origin");
    await removeTags(lightnovelId, "couple");
  }
}

/**
 * Delete lightnovel and its contents (chapter, etc..)
 * @param {Number} lightnovelId
 */
const deleteLightnovel = async (lightnovelId) => {
  const chapters = await queryPlaceholdersAsync("SELECT content FROM lchapter WHERE lnId = ?", [lightnovelId]);
  const filesToDelete = [];
  chapters.map(e => filesToDelete.push(...extractImageFromContent(JSON.parse(e.content))));
  await queryPlaceholdersAsync(
    "DELETE FROM ln WHERE id = ?",
    [lightnovelId]
  );

  removeFiles(filesToDelete);
}

const latestLightnovel = async (userId = 0, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL ORDER BY lastUpdate DESC LIMIT ?, ?",
    [userId, skip, limit]
  )

  const countResult = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS countResult FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL",
    [userId]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  );

  return {
    result,
    resultCount: countResult[0].countResult
  }
}

const latestLightnovelR18 = async (userId = 0, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID JOIN (SELECT lnID FROM ln_tag WHERE tagID = ?) r ON r.lnID = id WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL ORDER BY lastUpdate DESC LIMIT ?, ?",
    [userId, config.r18, skip, limit]
  )

  const countResult = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS countResult FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID JOIN (SELECT lnID FROM ln_tag WHERE tagID = ?) r ON r.lnID = id WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL",
    [userId, config.r18]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  )

  return {
    result,
    resultCount: countResult[0].countResult
  }
}

const getLightnovelInfoForNotif = async (lightnovelId) => {
  const ln = await queryPlaceholdersAsync("SELECT originalName, thumbnail FROM ln WHERE id = ? LIMIT 1", [lightnovelId]);
  return ln.length !== 0 ? ln[0] : null;
}

const getLightnovelTeamInfo = async (lightnovelId) => {
  const team = await queryPlaceholdersAsync(
    "SELECT teamID FROM ln_team WHERE lnID = ? LIMIT 1", [lightnovelId]
  );

  return team.length !== 0 ? team[0].teamID : null;
}

const getInfoLightnovel = async (lightnovelId, user) => {
  const prod = await queryPlaceholdersAsync(
    "CALL GET_LIGHTNOVEL( ? )",
    [lightnovelId]
  );

  if (prod[0].length === 0) {
    throw new NotFound("Truyện không tồn tại!");
  }

  const result = prod[0];
  result[0].team = prod[1];
  result[0].origin = prod[2];
  result[0].author = prod[3];
  result[0].tag = prod[4];
  result[0].couple = prod[5];
  result[0].chapters = prod[6];
  // result[0].thumbnail = `${config.host.storage}/${result[0].thumbnail}`;

  if (user) {
    const list = await queryPlaceholdersAsync(
      "SELECT y.listKey FROM user_list_ln ul, yurilist y WHERE ul.listKey = y.id AND userID = ? AND lnID = ? LIMIT 1",
      [user.id, lightnovelId]
    );
    const like = await queryPlaceholdersAsync(
      "SELECT EXISTS (SELECT 1 FROM ln_like WHERE userID = ? AND lnID = ? LIMIT 1) AS isLiked",
      [user.id, lightnovelId]
    );
    const subscribe = await queryPlaceholdersAsync(
      "SELECT EXISTS (SELECT 1 FROM ln_subscribe WHERE userID = ? AND lnID = ? LIMIT 1) AS subscribe",
      [user.id, lightnovelId]
    );

    const readChapter = await queryPlaceholdersAsync("SELECT h.chapterID, c.name FROM history_ln h JOIN lchapter c ON c.id = h.chapterID WHERE h.lnID = ? AND userID = ? LIMIT 1", [lightnovelId, user.id]);

    const userData = {};
    userData.list = list.length === 1 ? list[0].listKey : null;
    userData.like = like[0].isLiked === 1 ? true : false;
    userData.subscribe = subscribe[0].subscribe;
    userData.readChapter = readChapter.length === 1 ? readChapter[0] : null;
    result[0].userData = userData;
  }

  return result[0];
}

const listChapter = async (lightnovelId) => {
  const lightnovel = new Lightnovel(lightnovelId);
  const chapters = await lightnovel.listChapter();
  return chapters;
}

const getLightnovelByType = async ({ type, query }, { skip, limit }, userID = 0) => {
  const checkID = isNumeric(query);
  const detail = await queryPlaceholdersAsync(
    `SELECT * FROM ${type} WHERE (? = 1 AND id = ?) OR (? = 0 AND url = ?) LIMIT 1`,
    [checkID, query, checkID, query]
  )
  if (detail.length === 0) {
    throw new NotFound("Không tìm thấy dữ liệu!");
  }

  const result = await queryPlaceholdersAsync(
    `SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM ln JOIN (SELECT lnID FROM ln_${type} t1 JOIN ${type} t2 ON t1.${type}ID = t2.id WHERE (? = 1 AND t2.id = ?) OR (? = 0 AND t2.url = ?)) q ON q.lnID = id LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID WHERE (status != 1 AND ( status = 3 OR totalChapter != 0 )) AND bl.lnID IS NULL ORDER BY lastUpdate DESC LIMIT ?, ?`,
    [checkID, query, checkID, query, userID, skip, limit]
  )

  const resultCount = await queryPlaceholdersAsync(
    `SELECT COUNT(*) AS resultCount FROM ln JOIN (SELECT lnID FROM ln_${type} t1 JOIN ${type} t2 ON t1.${type}ID = t2.id WHERE (? = 1 AND t2.id = ?) OR (? = 0 AND t2.url = ?)) q ON q.lnID = id LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID WHERE (status != 1 AND ( status = 3 OR totalChapter != 0 )) AND bl.lnID IS NULL`,
    [checkID, query, checkID, query, userID]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  );

  return {
    result,
    resultCount: resultCount[0].resultCount,
    detail: detail[0]
  }
}

const getMyTeamLightnovel = async (teamID, query, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT * FROM ln JOIN ln_team lt ON ln.id = lt.lnID WHERE lt.teamID = ? AND originalName LIKE CONCAT(?, '%') ORDER BY lastUpdate DESC LIMIT ?, ?",
    [teamID, query, skip, limit]
  );


  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM ln JOIN ln_team lt ON ln.id = lt.lnID WHERE lt.teamID = ? AND originalName LIKE CONCAT(?, '%')",
    [teamID, query]
  )

  return {
    result: result,
    resultCount: resultCount[0].resultCount
  }
};

const getLightnovelUserData = async (lightnovelId, { id: userId }) => {
  const list = await queryPlaceholdersAsync(
    "SELECT y.listKey FROM user_list_ln ul, yurilist y WHERE ul.listKey = y.id AND userID = ? AND lnID = ? LIMIT 1",
    [userId, lightnovelId]
  );

  const lnLikeSub = await queryPlaceholdersAsync(
    "SELECT EXISTS (SELECT 1 FROM ln_like WHERE userID = ? AND lnID = ? LIMIT 1) AS isLiked, EXISTS (SELECT 1 FROM ln_subscribe WHERE userID = ? AND lnID = ? LIMIT 1) AS subscribe",
    [userId, lightnovelId, userId, lightnovelId]
  );

  return {
    list: list.length === 1 ? list[0].listKey : null,
    like: lnLikeSub[0].isLiked,
    subscribe: lnLikeSub[0].subscribe
  }
}

const incView = async (lightnovelId) => {
  await queryPlaceholdersAsync(
    "UPDATE ln SET weeklyView = weeklyView + 1, monthlyView = monthlyView + 1, dailyView = dailyView + 1, totalView = totalView + 1 WHERE id = ?",
    [lightnovelId]
  );
}

const rankLightnovelBy = async (type, userId) => {

  const result = await queryPlaceholdersAsync(
    `SELECT id, originalName, thumbnail, ${type} as counter FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL ORDER BY ${type} DESC LIMIT 5`,
    [userId]
  )

  await Promise.all(result.map(async e => {
    const ln = new Lightnovel(e.id);
    e.lastChapter = await ln.lastChapter();
    e.author = await ln.getTagByType("author");
    e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
  }));

  return result;
}

const rankTeamLightnovelBy = async (teamId, type, userId) => {
  const checkId = /^\d+$/.test(teamId);

  const result = await queryPlaceholdersAsync(
    `SELECT ln.id, originalName, thumbnail, ${type} as counter
      FROM ln
      LEFT JOIN
          ( SELECT DISTINCT m.lnID FROM ln_tag m
              JOIN blacklist b
              ON m.tagID = b.tagID
              WHERE b.userID = ? ) bl
          ON ln.id = bl.lnID
      JOIN ln_team lt
          ON ln.id = lt.lnID
      JOIN team t
          ON t.id = lt.teamID
      WHERE
          ( status != 1 AND ( status = 3 OR totalChapter != 0 ) )
          AND bl.lnID IS NULL
          AND (? = 0 AND url = ?) OR (? = 1 AND t.id = ?)
      ORDER BY ${type} DESC LIMIT 5`,
    [userId, checkId, teamId, checkId, teamId]
  );

  await Promise.all(result.map(async e => {
    const ln = new Lightnovel(e.id);
    e.lastChapter = await ln.lastChapter();
    e.author = await ln.getTagByType("author");
    e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
  }));

  return result;
}

const r18RankLightnovelBy = async (type, userId) => {
  const result = await queryPlaceholdersAsync(
    `SELECT id, originalName, thumbnail, ${type} as counter FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID JOIN (SELECT lnID FROM ln_tag WHERE tagID = ?) r ON r.lnID = id WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL ORDER BY ${type} DESC LIMIT 5`,
    [userId, config.r18]
  )

  await Promise.all(result.map(async e => {
    const ln = new Lightnovel(e.id);
    e.lastChapter = await ln.lastChapter();
    e.author = await ln.getTagByType("author");
    e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
  }));

  return result;
}

const randomLightnovel = async (userId) => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName, thumbnail FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL ORDER BY RAND() LIMIT 10",
    [userId]
  )

  await Promise.all(result.map(async e => {
    const ln = new Lightnovel(e.id);
    e.lastChapter = await ln.lastChapter();
    e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
  }));

  return result;
}

const r18RandomLightnovel = async (userId) => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName, thumbnail FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON id = bl.lnID JOIN (SELECT lnID FROM ln_tag WHERE tagID = ?) r ON r.lnID = id WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL ORDER BY RAND() LIMIT 10",
    [userId, config.r18]
  )

  await Promise.all(result.map(async e => {
    const ln = new Lightnovel(e.id);
    e.lastChapter = await ln.lastChapter();
    e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
  }));

  return result;
}

const likeLightnovel = async (lightnovelId, userId) => {
  await queryPlaceholdersAsync(
    "INSERT INTO ln_like(userID, lnID) VALUES(?, ?)",
    [userId, lightnovelId]
  )
  await queryPlaceholdersAsync(
    "UPDATE ln SET likeCount = likeCount + 1 WHERE id = ?",
    [lightnovelId]
  );
}

const checkLikedLightnovel = async (lightnovelId, userId) => {
  const ln = await queryPlaceholdersAsync(
    "SELECT 1 FROM ln_like WHERE userID = ? AND lnID = ? LIMIT 1",
    [userId, lightnovelId]
  )

  return ln.length === 1;
}

const unLikeLightnovel = async (lightnovelId, userId) => {
  await queryPlaceholdersAsync(
    "DELETE FROM ln_like WHERE userID = ? AND lnID = ?",
    [userId, lightnovelId]
  )

  await queryPlaceholdersAsync(
    "UPDATE ln SET likeCount = likeCount - 1 WHERE id = ?",
    [lightnovelId]
  );
}

const getLikedLightnovel = async (userId, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    `SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM ln JOIN ln_like ll ON ln.id = ll.lnID WHERE ll.userID = ? ORDER BY ll.createAt DESC LIMIT ?, ?`,
    [userId, skip, limit]
  );

  const resultCount = await queryPlaceholdersAsync(
    `SELECT COUNT(*) AS resultCount FROM ln JOIN ln_like ll ON ln.id = ll.lnID WHERE ll.userID = ?`,
    [userId]
  )

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  )

  return {
    result,
    resultCount: resultCount[0].resultCount
  };
}

const subscribeLightnovel = async (lightnovelId, userId) => {
  await queryPlaceholdersAsync(
    "INSERT INTO ln_subscribe(userID, lnID) VALUES(?, ?)",
    [userId, lightnovelId]
  );
}

const checkSubscribedLightnovel = async (lightnovelId, userId) => {
  const ln = await queryPlaceholdersAsync(
    "SELECT 1 FROM ln_subscribe WHERE userID = ? AND lnID = ? LIMIT 1",
    [userId, lightnovelId]
  )

  return ln.length === 1;
}

const unSubscribeLightnovel = async (lightnovelId, userId) => {
  await queryPlaceholdersAsync(
    "DELETE FROM ln_subscribe WHERE userID = ? AND lnID = ?",
    [userId, lightnovelId]
  )
}

const getCurrentListKey = async (lightnovelId, userId) => {
  const listKey = await queryPlaceholdersAsync(
    "SELECT y.listKey FROM yurilist y JOIN user_list_ln ul ON y.id = ul.listKey WHERE userID = ? AND lnID = ? LIMIT 1",
    [userId, lightnovelId]
  );

  return listKey;
}

const addToList = async (lightnovelId, userId, listKey) => {
  const list = await queryPlaceholdersAsync(
    "SELECT id from yurilist y where y.listKey = ? LIMIT 1",
    [listKey]
  );
  if (list.length === 0) throw BadRequest("List không tồn tại!");

  const currentListKey = await getCurrentListKey(lightnovelId, userId);

  await queryPlaceholdersAsync(
    "INSERT INTO user_list_ln(userID, lnID, listKey) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE listKey = ?, createAt = CURRENT_TIMESTAMP()",
    [userId, lightnovelId, list[0].id, list[0].id]
  );

  if (currentListKey.length === 1) {
    const oldCol = `${currentListKey[0].listKey}List`;
    console.log(oldCol);
    await queryPlaceholdersAsync(
      `UPDATE ln SET ${oldCol} = ${oldCol} - 1, totalFollow = totalFollow - 1 WHERE id = ?`,
      [lightnovelId]
    );
  }

  const col = `${listKey}List`;
  await queryPlaceholdersAsync(
    `UPDATE ln SET ${col} = ${col} + 1, totalFollow = totalFollow + 1 WHERE id = ?`,
    [lightnovelId]
  );
}

const removeFromList = async (lightnovelId, userId) => {
  const listKey = await getCurrentListKey(lightnovelId, userId);

  if (listKey.length === 0) throw new BadRequest("List không tồn tại!");

  await queryPlaceholdersAsync(
    "DELETE FROM user_list_ln WHERE userID = ? AND lnID = ?",
    [userId, lightnovelId]
  );

  const col = `${listKey[0].listKey}List`;
  await queryPlaceholdersAsync(
    `UPDATE ln SET ${col} = ${col} - 1, totalFollow = totalFollow - 1 WHERE id = ?`,
    [lightnovelId]
  );
}

const getListLightnovel = async (userId, type, { skip, limit }) => {
  const flagAll = type === "all";

  const result = await queryPlaceholdersAsync(
    `SELECT ln.id, originalName, otherName, thumbnail, ln.type, status, description, lastUpdate, y.listKey FROM ln JOIN user_list_ln ul ON ln.id = ul.lnID JOIN yurilist y ON y.id = ul.listKey WHERE ul.userID = ? AND (? OR y.listKey = ?) ORDER BY ul.createAt DESC LIMIT ?, ?`,
    [userId, flagAll, type, skip, limit]
  );

  const resultCount = await queryPlaceholdersAsync(
    `SELECT COUNT(*) AS resultCount FROM ln JOIN user_list_ln ul ON ln.id = ul.lnID JOIN yurilist y ON y.id = ul.listKey WHERE ul.userID = ? AND (? OR y.listKey = ?)`,
    [userId, flagAll, type]
  )

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  )

  return {
    result,
    resultCount: resultCount[0].resultCount
  };
}

const changeStatus = async (lightnovelId, status) => {
  await queryPlaceholdersAsync(
    "UPDATE ln SET status = ? WHERE id = ?",
    [status, lightnovelId]
  );
}

const searchByName = async (query, userId = 0, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON ln.id = bl.lnID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL AND (originalName LIKE CONCAT('%', ? , '%') OR otherName LIKE CONCAT('%', ? , '%')) ORDER BY CASE WHEN originalName LIKE CONCAT( ?, '%') THEN 1 WHEN otherName LIKE CONCAT( ?, '%') THEN 2 ELSE 3 END LIMIT ?, ?",
    [userId, query, query, query, query, skip, limit]
  );

  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM ln LEFT JOIN ( SELECT DISTINCT l.lnID FROM ln_tag l JOIN blacklist b ON l.tagID = b.tagID WHERE b.userID = ? ) bl ON ln.id = bl.lnID WHERE ( status != 1 AND ( status = 3 OR totalChapter != 0 ) ) AND bl.lnID IS NULL AND (originalName LIKE CONCAT('%', ? , '%') OR otherName LIKE CONCAT('%', ? , '%'))",
    [userId, query, query, query, query]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  )

  return {
    result,
    resultCount: resultCount[0].resultCount
  }
}

const getHistory = async (userId, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName, otherName, thumbnail, type, status, description, lastUpdate FROM ln JOIN history_ln h ON h.lnID = ln.id WHERE h.userID = ? ORDER BY lastRead DESC LIMIT ?,?",
    [userId, skip, limit]
  );

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  )

  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM history_ln WHERE userID = ?",
    [userId]
  );

  return {
    result,
    resultCount: resultCount[0].resultCount
  }
}

const getDirectoryGeneral = async () => {
  const result = await queryPlaceholdersAsync(
    "SELECT id, originalName FROM ln WHERE type = 1 AND (status != 1 AND (status = 3 OR totalChapter!=0))"
  );
  return result;
}

const SORT = Object.freeze({
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3,
  FOLLOW: 4,
  UPDATE: 5,
  CHAPTER: 6,
  DEFAULT: 7
})

const sortQuery = (sort) => {
  switch (sort) {
    case SORT.DAILY:
      return `ORDER BY dailyView DESC`;
    case SORT.WEEKLY:
      return `ORDER BY weeklyView DESC`;
    case SORT.MONTHLY:
      return `ORDER BY monthlyVew DESC`;
    case SORT.FOLLOW:
      return `ORDER BY totalFollow DESC`;
    case SORT.UPDATE:
      return `ORDER BY lastUpdate DESC`;
    case SORT.CHAPTER:
      return `ORDER BY totalChapter DESC`;
    default:
      return ``;
  }
}

const advancedSearch = async (tag = [], excludedTag = [], userId = 0, { sort, minChapter, status }, { skip, limit }) => {
  let subQuery = ``;
  const tagQ = tag.map(e => ` SUM(CASE WHEN tagID = ${parseInt(e, 10)} THEN 1 ELSE 0 END) > 0`);
  const excludedTagQ = excludedTag.map(e => ` SUM(CASE WHEN tagID = ${parseInt(e, 10)} THEN 1 ELSE 0 END) = 0`);
  tagQ.concat(excludedTagQ).forEach((e, index) => {
    if (index === 0) {
      subQuery += ` HAVING${e}`;
    } else {
      subQuery += ` AND${e}`;
    }
  });
  subQuery += `) t ON t.lnID = ln.id`
  const blacklist = ` LEFT JOIN (SELECT DISTINCT lnID FROM blacklist b JOIN ln_tag lt WHERE b.tagID = lt.tagID AND b.userID = ${userId}) bl ON bl.lnID = ln.id WHERE bl.lnID IS NULL`;
  const chapterCondition = ` AND totalChapter >= ${minChapter}`;
  const statusCondition = (status >= 2 && status <= 7) ? ` AND status = ${status} ` : ``;
  const sortQ = sortQuery(sort);
  const query = `SELECT ln.id, ln.originalName, ln.otherName, ln.description, ln.status, ln.type, ln.thumbnail, ln.lastUpdate FROM ln JOIN (SELECT lnID FROM ln_tag GROUP BY lnID${subQuery}${blacklist}${chapterCondition}${statusCondition}${sortQ} LIMIT ?, ?`;
  const countQuery = `SELECT COUNT(*) AS resultCount FROM ln JOIN (SELECT lnID FROM ln_tag GROUP BY lnID${subQuery}${blacklist}${chapterCondition}${statusCondition}`;
  const result = await queryPlaceholdersAsync(query, [skip, limit]);
  const resultCount = await queryPlaceholdersAsync(countQuery);

  await Promise.all(
    result.map(async (e) => {
      const id = e.id;
      const lightnovel = new Lightnovel(id);
      e.thumbnail = `${config.host.storage}/${e.thumbnail}`;
      e.origin = await lightnovel.getTagByType('origin');
      e.couple = await lightnovel.getTagByType('couple');
      e.author = await lightnovel.getTagByType('author');
      e.team = await lightnovel.getTagByType('team');
      e.tag = await lightnovel.getTagByType('tag');
      e.lastChapter = await lightnovel.lastChapter();
    })
  )

  return {
    result,
    resultCount: resultCount[0].resultCount
  }
}

const getAllLightnovel = async (query, { skip, limit }) => {
  const result = await queryPlaceholdersAsync(
    "SELECT ln.*, t.id teamID, t.name teamName, t.url teamUrl FROM ln JOIN ln_team lt ON ln.id = lt.lnID JOIN team t on lt.teamID = t.id WHERE originalName LIKE CONCAT(?, '%') ORDER BY lastUpdate DESC LIMIT ?, ?",
    [query, skip, limit]
  );


  const resultCount = await queryPlaceholdersAsync(
    "SELECT COUNT(*) AS resultCount FROM ln WHERE originalName LIKE CONCAT(?, '%')",
    [query]
  )

  return {
    result: result,
    resultCount: resultCount[0].resultCount
  }
}

module.exports = {
  create: createLightnovel,
  edit: updateLightnovel,
  delete: deleteLightnovel,
  findById,
  findTeamId,
  getLightnovelInfoForNotif,
  latestLightnovel,
  latestLightnovelR18,
  getInfoLightnovel,
  listChapter,
  getLightnovelByType,
  getMyTeamLightnovel,
  getUserData: getLightnovelUserData,
  incView,
  rankTeamLightnovelBy,
  rankLightnovelBy,
  r18RankLightnovelBy,
  randomLightnovel,
  r18RandomLightnovel,
  like: likeLightnovel,
  unlike: unLikeLightnovel,
  checkLikedLightnovel,
  subscribe: subscribeLightnovel,
  unsubscribe: unSubscribeLightnovel,
  checkSubscribedLightnovel,
  addToList,
  removeFromList,
  getListLightnovel,
  getLikedLightnovel,
  changeStatus,
  searchByName,
  getHistory,
  getDirectoryGeneral,
  advancedSearch,
  getAllLightnovel,
  getLightnovelTeamInfo
}
