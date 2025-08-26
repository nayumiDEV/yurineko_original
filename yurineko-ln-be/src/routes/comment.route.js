const express = require('express');
const validate = require('../middlewares/validate');
const userMiddleware = require('../middlewares/user');
const uploaderMiddleware = require('../middlewares/uploader');
const upload = require('../middlewares/upload');
const rateLimiter = require('../middlewares/rateLimiter');
const { commentValidation, queryValidation } = require('../validations');
const { commentController } = require('../controllers');

const router = express.Router();

const commentUploadMiddleware = upload.single('image');

router
    .route('/')
    .get(validate(commentValidation.get), commentController.get)
    .post(rateLimiter.shortSingleTimeLimiter, userMiddleware, commentUploadMiddleware, validate(commentValidation.create), commentController.create)

router.get('/all', uploaderMiddleware, validate(queryValidation.queryWithOnlyPagination), commentController.getAll);

router
    .route('/:id')
    .delete(uploaderMiddleware, validate(commentValidation.delete), commentController.delete)

router
    .post('/:id/like', rateLimiter.shortSingleTimeLimiter, userMiddleware, validate(queryValidation.queryWithOnlyParamId), commentController.like);
router
    .delete('/:id/unlike', rateLimiter.shortSingleTimeLimiter, userMiddleware, validate(queryValidation.queryWithOnlyParamId), commentController.unlike);

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: API liên quan đến comment
 * paths:
 *   /comment:
 *     get:
 *       summary: Lấy comment
 *       tags: [Comment]
 *       parameters:
 *         - in: query
 *           name: lightnovelID
 *           schema:
 *             type: integer
 *           required: true
 *         - in: query
 *           name: chapterID
 *           schema:
 *             type: integer
 *           required: true
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *         - in: query
 *           name: pageSize
 *           schema:
 *             type: integer
 *     post:
 *       summary: Tạo comment
 *       tags: [Comment]
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 lightnovelID:
 *                   type: integer
 *                 chapterID:
 *                   type: integer
 *                 replyID:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 image:
 *                   type: string
 *                   format: binary
 *             encoding:
 *               image:
 *                 contentType: image/png, image/jpeg
 * /comment/all:
 *   delete:
 *     summary: Danh sách comment team/admin
 *     tags: [Comment]
 * /comment/{id}:
 *   delete:
 *     summary: Xóa comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 * /comment/{id}/like:
 *   post:
 *     summary: Like comment
 *     description: Cần là thành viên
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 * /comment/{id}/unlike:
 *   delete:
 *     summary: Unlike comment
 *     description: Cần là thành viên
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 * 
 */
module.exports = router;