const express = require('express');

const router = express.Router();
const loginController = require('../../controllers/auth/login');
const LoginFBController = require('../../controllers/auth/loginFB');
const dashboardLogin = require('../../controllers/auth/dashboardLogin');
const registerController = require('../../controllers/auth/register');
const confirmController = require('../../controllers/auth/confirm');
const forgot = require("../../controllers/auth/forgot");
const resetPwd = require("../../controllers/auth/resetPwd");

const captcha = require('../../middlewares/captcha');

router.post('/forgot', captcha, forgot);
router.post('/resetPwd', resetPwd);
router.post("/login", loginController);
router.post("/loginFB", LoginFBController);
router.post("/dashboardLogin", dashboardLogin);
router.post("/register", captcha, registerController);
router.get("/confirm", confirmController);

module.exports = router;
