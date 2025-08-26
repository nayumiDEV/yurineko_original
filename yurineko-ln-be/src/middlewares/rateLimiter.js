const rateLimit = require('express-rate-limit');

const singleTimeLimiter = rateLimit({
  windowMs: 15 * 1000,
  max: 1,
});

const shortSingleTimeLimiter = rateLimit({
  windowMs: 3 * 1000,
  max: 1,
});

module.exports = {
  singleTimeLimiter,
  shortSingleTimeLimiter
};
