const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                    .integer()
                    .positive()
                    .required()
            case "description":
                return Joi.string()
                    .allow(null, '');
            case "bpm_id":
                return Joi.number()
                    .integer()
                    .positive()
                    .required()
            case "money":
                return Joi.number()
                    .integer()
                    .positive()
                    .required()
            
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};