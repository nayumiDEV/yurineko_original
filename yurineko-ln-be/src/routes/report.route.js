const express = require('express');
const { reportController } = require('../controllers');
const validate = require('../middlewares/validate');
const userAuth = require('../middlewares/user');
const { reportValidation, queryValidation } = require('../validations');
const uploaderAuth = require('../middlewares/uploader');
const router = express.Router();
router
    .route('/')
    .get(uploaderAuth, validate(queryValidation.queryWithOnlyPagination), reportController.get)
    .post(userAuth, validate(reportValidation.create), reportController.create);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: API report
 * paths:
 *   /report:
 *     get:
 *       summary: Danh sách report của truyện team
 *       tags: [Report]
 *       parameters:
 *         - in: query
 *           name: page
 *           schema: 
 *             type: integer
 *             minimum: 1
 *         - in: query
 *           name: pageSize
 *           schema:
 *             type: integer
 *             minimum: 1
 *     post:
 *       summary: Viết report truyện
 *       tags: [Report]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - lightnovelId
 *                 - chapterId
 *                 - type
 *                 - detail
 *               properties:
 *                 lightnovelId:
 *                   type: integer
 *                 chapterId:
 *                   type: integer
 *                 type:
 *                   type: integer
 *                 detail:
 *                   type: string
 *              
 *         
 * 
 */