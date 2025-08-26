const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "userID":
                return Joi.number()
                .integer()
                .positive()
                .required()
            case "type":
                return Joi.string()
                .required()
            case "money":
                return Joi.number()
                .integer()
                .multiple(5000)
                .message("Số tiền phải chia hết cho 5000")
                .required()
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};