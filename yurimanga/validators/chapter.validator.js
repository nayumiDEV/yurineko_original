const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                .integer()
                .positive()
                .required()
            case "name":
                return Joi.string()
            case "mangaID":
                return Joi.number()
                .integer()
                .positive()
                .required()
            case "chapterID":
                return Joi.number()
                .integer()
                .required()
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};