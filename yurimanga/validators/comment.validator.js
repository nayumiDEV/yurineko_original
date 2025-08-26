const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                .required()
            case "mangaID":
                return Joi.number()
                .required()
            case "chapterID":
                return Joi.number()
                .required()
            case "content":
                return Joi.string()
                .allow('', null)
            case "replyID":
                return Joi.number()
                .required()
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};