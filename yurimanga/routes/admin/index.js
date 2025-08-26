const express = require('express');

const router = express.Router();

/*           MIDDLEWARES              */
const auth = require('../../middlewares/auth');
const adminAuth = require('../../middlewares/admin');

/*            CONTROLLER              */
const user = require('../../controllers/admin/user');
const manga = require('../../controllers/admin/manga');
const team = require('../../controllers/admin/team');
const tag = require('../../controllers/admin/tag');
const couple = require('../../controllers/admin/couple');
const origin = require('../../controllers/admin/origin');
const author = require('../../controllers/admin/author');
const donate = require('../../controllers/admin/donate');
const comment = require('../../controllers/admin/comment');
const dashboard = require('../../controllers/admin/dashboard');
const setting = require('../../controllers/admin/web');
//const registerController = require('../../controllers/auth/register');

/*               ADMIN                */
router.get("/dashboard", dashboard);
router.post("/setting", setting.setCover);

/*               TEAM                 */
router.get("/team/find", team.find);
router.get("/team/:id", team.info);
router.post("/team/add", team.addMember);
router.post("/team/remove", team.rmMember);
router.post("/team/changeOwner", team.changeOwner);
router.get("/team/list-manga/:id", team.listManga);



/*               FIND                 */
router.get("/tag/find", tag.find);
router.get("/origin/find", origin.find);
router.get("/couple/find", couple.find);
router.get("/author/find", author.find);


/*               USER                 */
router.get("/user/find", user.find)
router.post("/user/ban", user.ban);

/*               LIST                 */
router.get("/user", user.list);
router.get("/manga2", manga.list);
router.get("/manga", manga.list);
router.get("/team", team.list);
router.get("/tag", tag.list);
router.get("/couple", couple.list);
router.get("/origin", origin.list);
router.get("/author", author.list);
router.get("/donate", donate.list);
router.get("/comment", comment.list);

/*                ADD                 */
router.post("/team", team.add);
router.post("/tag", tag.add);
router.post("/couple", couple.add);
router.post("/origin", origin.add);
router.post("/author", author.add);
router.post("/donate", donate.add);

/*               EDIT                 */
router.patch("/team/:id", team.edit);
router.patch("/tag/:id", tag.edit);
router.patch("/couple/:id", couple.edit);
router.patch("/origin/:id", origin.edit);
router.patch("/author/:id", author.edit);

/*              DELETE                */
router.delete("/team/:id", team.delete);
router.delete("/tag/:id", tag.delete);
router.delete("/couple/:id", couple.delete);
router.delete("/origin/:id", origin.delete);
router.delete("/author/:id", author.delete);

module.exports = router;
