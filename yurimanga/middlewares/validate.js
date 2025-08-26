const { BadRequest } = require("../helpers/response");
const { AsyncCatch } = require("../helpers/utilities");
const pick = require("../helpers/pick");
const Joi = require("joi");

const validate = schema => AsyncCatch(async (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    throw new BadRequest(error.message);
  }
  Object.assign(req, value);
  return next();
});

module.exports = validate;