const { NotFound } = require("../../helpers/response");
const { AsyncCatch, validator } = require("../../helpers/utilities");
const userValidator = require("../../validators/user.validator");
const db = require("../../db");
const { AWS_S3_HOST_NAME } = require("../../configs/env");

const getProfile = AsyncCatch(async (req, res, next) => {
  let column, val;
  
  val = req.params.username;
  
  // if (req.query && req.query.id) {
  //   const { id } = validator(userValidator(["id"]), req.query);
  //   val = id;
  //   column = "id";
  // } else if (req.params && req.params.username) {
  //   val = req.params.username;
  //   column = "username";
  // } else throw new NotFound("Trang cá nhân bạn tìm kiếm không tồn tại!");

  const profile = await db.queryPlaceholdersAsync(
    `SELECT id, name, email, username, phone, gender, shortBio, dob, place_of_birth, love, bio, role, teamID, avatar, cover, money, createAt, premiumTime, (premiumTime > CURRENT_TIMESTAMP()) AS isPremium FROM user WHERE id = ? OR username = ? LIMIT 1`,
    [val, val]
  );

  if (profile.length == 0)
    throw new NotFound("Trang cá nhân bạn tìm kiếm không tồn tại!");

  const result = profile[0];
  result.avatar = `${AWS_S3_HOST_NAME}/${result.avatar}`;
  result.cover = `${AWS_S3_HOST_NAME}/${result.cover}`;
  const team = await db.queryPlaceholdersAsync(
    "SELECT id, name, url FROM team WHERE id = ?",
    [result.teamID]
  );
  delete result.teamID;
  result.edit = false;
  if (req.userData && result.id == req.userData.id) result.edit = true;
  result.team = team[0];
  res.send(result);
});

const addPush = AsyncCatch(async (req, res, next) => {
  const { id } = req.userData;
  const { pushData } = req.body;
  if (
    pushData &&
    pushData["endpoint"] &&
    pushData["keys"]["p256dh"] &&
    pushData["keys"]["auth"]
  ) {
    await db.queryPlaceholdersAsync(
      "INSERT INTO user_push (userID, pushData) VALUES (?, ?)",
      [id, JSON.stringify(pushData)]
    );

    res.send("Success!");
  } else next(new Error("Dữ liệu không chính xác"));
});
module.exports = {
  get: getProfile,
  addPush,
};
