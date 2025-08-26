const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                .integer()
                .greater(0)
                .required()
            case "name":
                return Joi.string()
                .required()
            case "url":
                return Joi.string()
                .min(1)
                .max(100)
                .pattern(/^[a-zA-Z0-9_.-]*$/)
                .required()
            case "description":
                return Joi.string()
                .allow(null, '')
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};