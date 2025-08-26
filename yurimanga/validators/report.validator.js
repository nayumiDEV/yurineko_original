const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                    .positive()
                    .required();
            case "chapterID":
                return Joi.number()
                    .positive()
                    .required()
            case "mangaID":
                return Joi.number()
                    .positive()
                    .required()
            case "type":
                return Joi.number()
                    .integer()
                    .positive()
                    .required()
            case "detail":
                return Joi.string()
                    .allow(null, '');
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};