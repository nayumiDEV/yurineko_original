const Notification = require("../../class/notification");
const { Unauthorized } = require("../../helpers/response");
const { AsyncCatch, validator } = require("../../helpers/utilities");
const notificationValidator = require("../../validators/notification.validator");

module.exports.createNotification = AsyncCatch(async (req, res) => {
  if (!req.headers.auth || req.headers.auth != "^?+C+5=LvF7$!R#ym$cxsF#K^2Ja3nu58Z@xT6UyyrY_sG2*ZP") {
    throw new Unauthorized("Who are you?");
  }

  const { type, title, body, url, objectId, senderId, thumbnail, icon, push } = validator(notificationValidator(["type", "title", "body", "url", "objectId", "senderId", "thumbnail", "icon", "push"]), req.body);
  const notif = new Notification({
    type,
    title,
    body,
    url,
    objectId,
    senderId,
    thumbnail,
    icon
  });
  await notif.save();
  res.send("Success!");
})