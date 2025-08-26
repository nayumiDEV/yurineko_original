const {AsyncCatch,validator} = require("../../helpers/utilities");
const {BadRequest,InternalServerError} = require('../../helpers/response');
const userValidator = require("../../validators/user.validator");
const {HashPassword} = require('../../helpers/jwt');
const db = require('../../db');
const { v4 : uuidv4 } = require('uuid');
const mailTo = require("../../helpers/mail");
const env = require("../../configs/env");
module.exports = AsyncCatch(async (req, res, next) => {
    // validate
    const input = validator(userValidator(['email', 'password', 'name']), req.body);
    const checkUser = await db.queryPlaceholdersAsync('SELECT EXISTS( SELECT 1 FROM user WHERE email = ?) AS exist', [input.email]);
    if(checkUser[0].exist == true) throw new BadRequest('Email đã được sử dụng!');
    
    // create account
    const hashedPwd = HashPassword(input.password);
    const confirmToken = uuidv4();
    const username = uuidv4();
    const user = await db.queryPlaceholdersAsync('INSERT INTO user (email, password, username, name, confirmToken, confirmed) VALUES(?, ?, ?, ?, ?, 0)',[
        input.email.toLowerCase(),
        hashedPwd,
        username,
        input.name,
        confirmToken
    ]);
    await db.queryPlaceholdersAsync("INSERT into user_config (userID) VALUES (?)",[user.insertId])
    mailTo({
        target: input.email,
        subject: "Xác thực tài khoản yurineko",
        title: "Xác thực tài khoản",
        name: input.name,
        content: "Bạn đã đăng ký tài khoản trên yurineko.moe thành công! Hãy bấm nút <Xác nhận> bên dưới để xác thực tài khoản! Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này!",
        link: `${env.HOST}/auth/confirm?token=${confirmToken}`,
        button: 'Xác nhận tài khoản'
    }, next)

    res.send('Success!');
})