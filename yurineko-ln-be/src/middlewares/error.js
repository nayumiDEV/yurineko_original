const config = require('../config/config');
const logger = require('../config/logger');
const { DefaultError, STATUS_CODE } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof DefaultError) {
    return res.status(err.getCode()).json({
      message: err.message,
      ...(config.env === 'development' && { stack: err.stack })
    })
  };
  logger.error(err);
  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    message: 'Something wrong! Try again!',
    ...(config.env === 'development' && { stack: err.stack }),
  })

};

module.exports = {
  errorHandler,
};
