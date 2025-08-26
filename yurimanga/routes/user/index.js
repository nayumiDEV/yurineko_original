const express = require("express");
const uploadMidlleware = require('../../helpers/upload');
const blacklist = require("../../controllers/user/blacklist");
const chapter = require("../../controllers/user/chapter");
const comment = require("../../controllers/user/comment");
const manga = require("../../controllers/user/manga");
const notification = require("../../controllers/user/notification");
const payment = require("../../controllers/user/payment");
const profile = require("../../controllers/user/profile");
const team = require("../../controllers/user/team");
const report = require("../../controllers/user/report");
const yurilist = require("../../controllers/user/yurilist");
const renew = require("../../controllers/user/renew");
const limiter = require("../../middlewares/limiter");
const captcha = require("../../middlewares/captcha");
const validate = require("../../middlewares/validate");
const { reaction, unReaction, listUserReaction } = require("../../validators/reaction.validator");
const temporaryImageUpload = require("../../controllers/image");
const commentUploadImageMiddleware = uploadMidlleware.single('image');
const avatarUploadMiddleware = uploadMidlleware.single('avatar');
const coverUploadMiddleware = uploadMidlleware.single('cover');

const router = express.Router();


router.get("/me", profile.me);
router.post("/profile", limiter(), profile.updateProfile);
router.patch("/username", limiter(), profile.updateUsername);
router.post("/avatar", limiter(), avatarUploadMiddleware, profile.updateAvatar);
router.post("/cover", limiter(), coverUploadMiddleware, profile.updateCover);
router.post("/report", captcha, limiter(), report.add);
router.get("/renew", renew);


router.get("/notification", notification.list);
router.get("/notification/seen", notification.seen);
router.patch("/notification/:id/read", notification.markRead);
router.patch("/notification/readAll", notification.markReadAll);

router.patch("/changePassword", profile.changePassword);

router.get("/notificationOption", profile.getNotificationOption);
router.patch("/notificationOption", profile.setNotificationOption);


router.get("/like", yurilist.likeList);
router.get("/list/:param", yurilist.getList);
router.post("/yurilist", yurilist.addToList);
router.delete("/yurilist", yurilist.removeFromList);
router.patch("/yurilist", yurilist.changeList);
router.get("/history", yurilist.history);

/*              COMMENT                 */
// router.get("/comment/:id/reaction", validate(listUserReaction), comment.getListUserReaction);
// router.post("/comment", limiter(), commentUploadImageMiddleware, comment.add);
// router.post("/comment/like", limiter(1, 1.5), validate(reaction), comment.like);
// router.post("/comment/unlike", limiter(1, 1.5), validate(unReaction), comment.unlike);

/*              CHAPTER                 */
router.get("/chapter/:id/reaction", validate(listUserReaction), chapter.getListUserReaction);
router.post("/chapter/like", limiter(1, 1.5), validate(reaction), chapter.like);
router.post("/chapter/unlike", limiter(1, 1.5), validate(unReaction), chapter.unlike);

/*              MANGA                 */
router.post("/manga/like", limiter(), validate(reaction), manga.like);
router.post("/manga/unlike", limiter(), validate(unReaction), manga.unlike);
router.post("/manga/subscribe", limiter(), manga.subscribe);
router.post("/manga/unsubscribe", limiter(), manga.unsubscribe);

/*              TEAM                 */
router.get("/team/listFollow", limiter(), team.listFollow);
router.post("/team/follow", limiter(), team.follow);
router.post("/team/unfollow", limiter(), team.unfollow);
router.post("/team/subscribe", limiter(), team.subscribe);
router.post("/team/unsubscribe", limiter(), team.unsubscribe);

/*              BLACKLIST                 */
router.get("/blacklist", blacklist.get);
router.post("/blacklist", blacklist.add);
router.delete("/blacklist/:id", blacklist.remove)

/*              PREMIUM                 */
router.post("/order", captcha, limiter(), payment.placeOrder);
router.post("/premium", payment.reg);

router.post("/image", limiter(20, 1800), commentUploadImageMiddleware, temporaryImageUpload)

module.exports = router;
