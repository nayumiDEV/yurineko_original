const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error');
const auth = require('./middlewares/auth');
const schedule = require('node-schedule');
const { cronjobService } = require('./services');
const app = express();

// 3 A.M every day
const dailyJob = schedule.scheduleJob('0 3 * * *', async (fireDate) => {
  await cronjobService.daily();
});

// 3 A.M day 1 every week
const weeklyJob = schedule.scheduleJob('0 3 * * 1', async (fireDate) => {
  await cronjobService.weekly();
});

// 3 A.M day 1 every month
const monthlyJob = schedule.scheduleJob('0 3 1 * *', async (fireDate) => {
  await cronjobService.weekly();
});

var allowlist = [
  "https://yurineko.net",
  "https://admin.yurineko.net",
  "https://www.yurineko.net",
  "https://ln.yurineko.net",
  "http://localhost:3000",
  "http://103.48.194.108:3003",
  "http://103.48.194.108:3004"
];

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // const origin = req.header("Origin");
  // if (allowlist.includes(origin)) {
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  // }
    res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);

  // Pass to next layer of middleware
  next();
});


if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

if (config.env !== 'development') {
  // set security HTTP headers
  app.use(helmet());
}

// parse json request body
app.use(express.json({ limit: "17mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: "17mb", extended: true }));

app.use(compression());

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));

// api routes
app.use('/', auth, routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.status(404).send("Unable to find reqested resources!");
});

// handle error
app.use(errorHandler);

module.exports = app;
