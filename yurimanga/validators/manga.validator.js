const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                .integer()
                .positive()
                .required()
            case "originalName":
                return Joi.string()
                .required()
            case "otherName":
                return Joi.string()
                .allow('')
            case "description":
                return Joi.string()
                .allow("", null)
            case "status":
                return Joi.number()
                .min(1)
                .max(5)
                .default(1)
            case "thumbnail":
                return Joi.string()
                .required()
            case "type":
                return Joi.number()
                .integer()
                .min(1)
                .max(2)
                .required()
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};