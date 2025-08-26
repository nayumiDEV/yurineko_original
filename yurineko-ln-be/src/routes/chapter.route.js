const express = require('express');
const validate = require('../middlewares/validate');
const uploaderAuth = require('../middlewares/uploader');
const rateLimiter = require('../middlewares/rateLimiter');
const userAuth = require('../middlewares/user');
const { chapterValidation, queryValidation } = require('../validations');
const chapterController = require('../controllers/chapter');
const router = express.Router();

router
    .route('/')
    .post(uploaderAuth, validate(chapterValidation.create), chapterController.create);


router.get('/fullInfo/:id', uploaderAuth, validate(queryValidation.queryWithOnlyParamId), chapterController.getChapterInfoForEdit);


router
    .route('/:id')
    .get(validate(queryValidation.queryWithOnlyParamId), chapterController.read)
    .patch(uploaderAuth, validate(chapterValidation.edit), chapterController.edit)
    .delete(uploaderAuth, validate(queryValidation.queryWithOnlyParamId), chapterController.delete)

router.post('/:id/like', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), chapterController.like);
router.delete('/:id/unlike', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), chapterController.unlike);
router.patch('/:id/sequence', uploaderAuth, validate(chapterValidation.changeSequence), chapterController.changeSequence);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Chapter
 *   description: API liên quan đến chapter
 * /chapter:
 *   post:
 *     summary: Tạo chapter
 *     description: Cần quyền uploader
 *     tags: [Chapter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *               - lightnovelId
 *               - publish
 *             properties:
 *               name:
 *                 type: string
 *               lightnovelId:
 *                 type: integer
 *               publish:
 *                 type: integer
 *                 enum: [0, 1]
 *               content:
 *                 type: object
 * paths:
 *   /chapter/{id}:
 *     get:
 *       summary: Đọc chapter
 *       tags: [Chapter]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: chapterID
 *     patch:
 *       summary: Sửa chapter
 *       tags: [Chapter]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: Chapter ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - content
 *                 - publish
 *               properties:
 *                 name:
 *                   type: string
 *                 publish:
 *                   type: integer
 *                   enum: [0, 1]
 *                 content:
 *                   type: object
 *     delete:
 *       summary: Xóa chapter
 *       tags: [Chapter]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: Chapter ID
 * /chapter/fullInfo/{id}:
 *   get:
 *     summary: Lấy info chapter để edit
 *     description: Cần quyền uploader
 *     tags: [Chapter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 * /chapter/{id}/like:
 *   post:
 *     summary: Like chapter
 *     tags: [Chapter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 * /chapter/{id}/unlike:
 *   delete:
 *     summary: Unlike chapter
 *     tags: [Chapter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 * /chapter/{id}/sequence:
 *   patch:
 *     summary: Đổi thứ tự chapter
 *     tags: [Chapter]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sequence
 *             properties:
 *               sequence:
 *                 type: integer
 */