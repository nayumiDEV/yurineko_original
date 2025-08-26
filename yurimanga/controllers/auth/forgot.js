const { AsyncCatch, validator } = require("../../helpers/utilities");
const userValidator = require('../../validators/user.validator');
const db = require('../../db');
const { NotFound } = require("../../helpers/response");
const mailTo = require("../../helpers/mail");
const { v4 : uuidv4 } = require('uuid');
const env = require("../../configs/env");

module.exports = AsyncCatch(async (req, res, next) => {
    try {
        const { email } = validator(userValidator(['email']), req.body);
        const checkUser = await db.queryPlaceholdersAsync("SELECT id, name FROM user WHERE email = ? LIMIT 1", [email]);
        if (checkUser.length == 0) throw new NotFound("Email không tồn tại!");

        const param = [
            uuidv4(),
            Math.round((Date.now() + 86400000) / 1000),
            checkUser[0].id
        ];

        db.queryPlaceholdersAsync('UPDATE user SET passwordResetToken = ?, resetPasswordExpired = FROM_UNIXTIME( ? ) WHERE id = ?', param);
        res.send("Success!");
        mailTo({
            target: email,
            subject: "Lấy lại mật khẩu Yurineko.net",
            title: "Lấy lại mật khẩu",
            name: checkUser[0].name,
            content: "Chúng tôi nhận được yêu cầu đổi mật khẩu trên Yurineko.net của bạn, vui lòng nhấn vào đường dẫn bên dưới để đổi mật khẩu. Link sẽ hết hạn sau 1 giờ!",
            link: `${env.HOST}/reset?token=${param[0]}`,
            button: 'Lấy lại mật khẩu'
        }, next);
    } catch (error) {
        next(error);
    }
})
