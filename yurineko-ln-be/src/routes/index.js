const express = require('express');
const docsRoute = require('./docs.route');
const lightnovelRoute = require('./lightnovel.route');
const chapterRoute = require('./chapter.route');
const commentRoute = require('./comment.route');
const reportRoute = require('./report.route');
const config = require('../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/lightnovel',
    route: lightnovelRoute,
  },
  {
    path: '/chapter',
    route: chapterRoute,
  },
  {
    path: '/comment',
    route: commentRoute
  },
  {
    path: '/report',
    route: reportRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },

];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
