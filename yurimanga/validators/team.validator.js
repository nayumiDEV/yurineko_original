const Joi = require("joi");

module.exports = function (fields = []) {
    const getSchema = (field) => {
        switch (field) {
            case "id":
                return Joi.number()
                    .integer()
                    .greater(0)
                    .required()
            case "url": Joi.string()
                .min(1)
                .max(50)
                .pattern(/^[a-zA-Z0-9_.-]*$/)
                .required()
            case "name":
                return Joi.string()
                    .required()
            case "description":
                return Joi.string()
                    .allow(null, '');
            case "social":
                return Joi.array().items(Joi.object().keys({
                    type: Joi.string().valid("link", "facebook", "discord", "wordpress", "blogger").default("link"),
                    link: Joi.string().uri({
                        scheme: [
                            'http',
                            'https'
                        ]
                    })
                }))
        }
    };

    const schema = {};

    for (let item of fields) {
        schema[`${item}`] = getSchema(item);
    }

    return schema;
};