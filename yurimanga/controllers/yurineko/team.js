const {
  AWS_S3_HOST_NAME,
  HOST
} = require("../../configs/env");
const db = require("../../db");
const {
  NotFound
} = require("../../helpers/response");
const {
  validator,
  AsyncCatch,
  pagination
} = require("../../helpers/utilities");
const teamValidator = require("../../validators/team.validator");
const teamRankingValidator = require("../../validators/teamRanking.validator");
const teamService = require('../../services/team.service');

const listTeamForUser = AsyncCatch(async (req, res, next) => {
  const result = await db.queryPlaceholdersAsync(
    `SELECT id, name, url FROM team WHERE id != 1 ORDER BY name`
  );
  result.forEach(e => {
    e.url = `${HOST}/${e.url}`;
  });
  res.send(result);
})

const infoTeam = AsyncCatch(async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    if (id == 1 || !id) throw new NotFound("Team không tồn tại!");
    const checkID = /^\d+$/.test(id);
    const result = await db.queryPlaceholdersAsync(
      "SELECT id, name, url, description, avatar, cover, createAt, followCount follower FROM team WHERE (? = 0 AND url = ?) OR (? = 1 AND id = ?)",
      [checkID, id, checkID, id]
    );

    if (result.length == 0) throw new NotFound("Team không tồn tại!");
    const data = result[0];
    data.avatar = `${AWS_S3_HOST_NAME}/${data.avatar}`;
    data.cover = `${AWS_S3_HOST_NAME}/${data.cover}`;
    data.members = await db.queryPlaceholdersAsync(
      "SELECT id, name, username, avatar FROM user WHERE teamID = ?",
      [result[0].id]
    );
    data.members.map((e) => {
      e.avatar = `${AWS_S3_HOST_NAME}/${e.avatar}`;
      return e;
    });

    if (req.userData) {
      data.userData = {};
      const subscribe = await db.queryPlaceholdersAsync(
        "SELECT * FROM team_subscribe WHERE userID = ? AND teamID = ?",
        [req.userData.id, result[0].id]
      );
      const follow = await db.queryPlaceholdersAsync(
        "SELECT * FROM team_follow WHERE userID = ? AND teamID = ?",
        [req.userData.id, result[0].id]
      );
      data.userData.subscribe = subscribe.length > 0;
      data.userData.follow = follow.length > 0;
    }
    data.social = await teamService.getTeamSocialLink(data.id);

    res.send(data);
  } catch (err) {
    throw err;
  }
});

const teamRanking = AsyncCatch(async (req, res, next) => {
  const {
    value,
    error
  } = teamRankingValidator.validate(req);
  const userId = req.userData ? req.userData.id : 0;
  const {
    type
  } = value.query;
  const {
    id
  } = value.params;
  switch (type) {
    case 'view':
      const data = {};
      data.day = await teamService.getTeamRanking(id, 'dailyView', userId);
      data.week = await teamService.getTeamRanking(id, 'weeklyView', userId);
      data.month = await teamService.getTeamRanking(id, 'monthlyView', userId);
      data.total = await teamService.getTeamRanking(id, 'totalView', userId);
      res.send(data);
      break;
    case 'list':
      res.send(await teamService.getTeamRanking(id, 'totalFollow', userId));
      break;
    case 'like':
      res.send(await teamService.getTeamRanking(id, 'likeCount', userId));
      break;
  }
})

module.exports = {
  list: listTeamForUser,
  info: infoTeam,
  ranking: teamRanking
};