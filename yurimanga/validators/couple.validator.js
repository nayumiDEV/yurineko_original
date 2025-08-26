const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "name":
                return Joi.string()
                .required()
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};