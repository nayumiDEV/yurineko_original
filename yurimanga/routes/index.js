const express = require("express");
const router = express.Router();
const db = require("../db");

/*          MIDDLEWARES           */
const authMiddleware = require("../middlewares/auth");
const uploaderMiddleware = require("../middlewares/uploader");
const adminMiddleware = require("../middlewares/admin");
const userMiddleware = require("../middlewares/user");

/*          MORE ROUTE...         */
const authRoute = require("./auth/");
const uploaderRoute = require("./uploader/");
const adminRoute = require("./admin/");
const userRoute = require("./user/");

router.use("/auth", authRoute);
router.use("/uploader", uploaderMiddleware, uploaderRoute);
router.use("/admin", adminMiddleware, adminRoute);
router.use("/user", userMiddleware, userRoute);

/*          REGULAR ROUTE         */
const ranking = require("../controllers/yurineko/ranking");
const getCover = require("../controllers/yurineko/cover");
const manga = require("../controllers/yurineko/manga");
const tag = require("../controllers/admin/tag");
const couple = require("../controllers/admin/couple");
const author = require("../controllers/admin/author");
const origin = require("../controllers/admin/origin");
const viewChapter = require("../controllers/yurineko/chapter");
const profile = require("../controllers/yurineko/profile");
const team = require("../controllers/yurineko/team");
const notification = require("../controllers/yurineko/notification");

const webpush = require("../helpers/push");
const comment = require("../controllers/yurineko/comment");
const premiumPlan = require("../controllers/yurineko/premiumPlan");
const auth = require("../middlewares/auth");
const directory = require("../controllers/yurineko/directory");
const r18 = require("../controllers/yurineko/r18");
const r18Ranking = require("../controllers/yurineko/r18Ranking");
const payment = require("../controllers/user/payment");

router.get("/cover/:place", getCover);
router.get("/ranking/:type",ranking);

//may cai cu cac dung :id phai dem xuong duoi cung
router.get("/manga/:id", manga.info);

router.get("/lastest2", manga.lastest);
router.get("/lastest", manga.lastest);
router.get("/random", manga.random);
router.get("/read/:mangaID/:chapterID", viewChapter);
router.get("/tag/find", tag.find);
router.get("/author/find", author.find);
router.get("/origin/find", origin.find);
router.get("/couple/find", couple.find);
router.get("/search", manga.search);
router.get("/searchType", manga.searchType);
// router.get("/comment", comment.get);
router.get("/team/", team.list);
router.get("/team/:id", team.info);
router.get("/team/:id/rank", team.ranking);
router.get("/advancedSearch", manga.advSearch);
router.get("/premium", premiumPlan);
router.get("/directory/:type", directory);
router.get("/r18Lastest", r18.lastest);
router.get("/r18Random", r18.random);
router.get("/r18Ranking/:type", r18Ranking);

/*              USER            */
router.get("/profile", profile.get);
router.post("/profile/pushNotify", userMiddleware, profile.addPush);
router.get("/profile/:username", profile.get);
router.post("/addFunds/:id", payment.addFunds);
router.post("/push", notification.createNotification);

module.exports = router;

// đây là cách dùng notification
// cần implement hệ thống follow
// có thể tạo notification mà không cần link với user hoặc ko cần save

// async function run() {
// var n = new notification({
//   title: "hello all",
//   body: "xin chao",
//   url: "cac",
//   type: "web",
//   objectID: 3,
// });
// const notificationID = await await n.save();
// // await n.link(notificationID);
// await n.push();
// }

// run();
