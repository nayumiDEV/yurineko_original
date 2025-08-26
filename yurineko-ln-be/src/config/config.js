const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const { resolve } = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    DB_HOST: Joi.string().ip().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().port().required(),
    STORAGE_HOST: Joi.string().required(),
    R18: Joi.number().integer().equal(1),
    PAGE_SIZE: Joi.number().integer().positive().required()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  database: {
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    name: envVars.DB_NAME,
    port: envVars.DB_PORT
  },
  host:{
    storage: envVars.STORAGE_HOST
  },
  r18: envVars.R18,
  pageSize: envVars.PAGE_SIZE,
  dir: {
    storage: resolve(`${__dirname}/../storage`),
  }
};
