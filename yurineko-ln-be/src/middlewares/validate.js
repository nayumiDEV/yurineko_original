const Joi = require('joi');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { BadRequest } = require('../utils/response');

const validate = (schema) => catchAsync((req, res, next) => {
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
