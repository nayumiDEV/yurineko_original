const JoiBase = require("joi");
const JoiDate = require("@hapi/joi-date");
const Joi = JoiBase.extend(JoiDate)
module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                    .integer()
                    .positive()
                    .required()
            case "email":
                return Joi.string()
                    .email()
                    .invalid('info@yurineko.moe')
                    .required()
            case "name":
                return Joi.string()
                    .min(1)
                    .max(50)
                    .required()
            case "username":
                return Joi.string()
                    .pattern(/^[a-z](?:[a-z0-9_.]+)*$/)
                    .min(3)
                    .max(30)
                    .required()
            case "password":
                return Joi.string()
                    .min(6).message("Mật khẩu phải có độ dài tối thiểu 6 kí tự!")
                    .required()
            case "phone":
                return Joi.string()
                    .pattern(/^[0-9]+$/).message("Số điện thoại không hợp lệ!")
            case "gender":
                return Joi.number()
                    .min(0)
                    .max(2)
            case "love":
                return Joi.string()
                    .allow("", null)
            case "role":
                return Joi.number()
                    .min(0)
                    .max(2)
                    .default(1)
            case "teamID":
                return Joi.number()
                    .min(1)
                    .default(1)
            case "dob":
                return Joi.date()
                    .format('DD/MM/YYYY')
                    .max('now');
            case "money":
                return Joi.number()
            case "isBanned":
                return Joi.number()
                    .min(0)
                    .max(1)
            case "isGrid":
                return Joi.number()
                    .min(0)
                    .max(1)
                    .default(0)
        }
    }

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
}