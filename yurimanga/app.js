var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const schedule = require('node-schedule');
var indexRouter = require("./routes/");
const { handleError } = require("./helpers/utilities");
const reset = require("./helpers/reset");
const authMiddleware = require("./middlewares/auth");

var app = express();

// 3 A.M every day
const dailyJob = schedule.scheduleJob('0 3 * * *', async (fireDate) => {
  await reset.daily();
});

// 3 A.M day 1 every week
const weeklyJob = schedule.scheduleJob('0 3 * * 1', async (fireDate) => {
  await reset.weekly();
});

// 3 A.M day 1 every month
const monthlyJob = schedule.scheduleJob('0 3 1 * *', async (fireDate) => {
  await reset.monthly();
});


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// // app.set('view engine', 'jade');
var allowlist = [
  "https://yurineko.moe",
  "https://admin.yurineko.moe",
  "https://www.yurineko.moe",
  "https://ln.yurineko.moe",
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
// app.use(cors());

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
app.use(helmet());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authMiddleware, indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send("Unable to find reqested resources!");
});

// error handler
app.use(handleError);

module.exports = app;
