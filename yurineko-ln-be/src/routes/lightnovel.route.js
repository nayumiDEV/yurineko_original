const express = require('express');
const { lightnovelController } = require('../controllers');
const validate = require('../middlewares/validate');
const uploaderAuth = require('../middlewares/uploader');
const userAuth = require('../middlewares/user');
const adminAuth = require('../middlewares/admin');
const rateLimiter = require('../middlewares/rateLimiter');
const { queryValidation, lightnovelValidation } = require('../validations');

const router = express.Router();

// uploader
router
    .route('/')
    .get(validate(queryValidation.queryWithFinding), lightnovelController.searchByName)
    .post(uploaderAuth, validate(lightnovelValidation.create), lightnovelController.create);


router.get('/latest', validate(queryValidation.queryWithOnlyPagination), lightnovelController.lastest);
router.get('/latestR18', validate(queryValidation.queryWithOnlyPagination), lightnovelController.lastestR18);
router.get('/searchByType', validate(lightnovelValidation.searchByType), lightnovelController.searchLightnovelByType);
router.get('/teamLightnovel', uploaderAuth, validate(queryValidation.queryWithFinding), lightnovelController.teamLightnovel);
router.get('/ranking', validate(queryValidation.queryOnlyType), lightnovelController.rank);
router.get('/r18Ranking', validate(queryValidation.queryOnlyType), lightnovelController.r18Ranking);
router.get('/random', lightnovelController.random);
router.get('/r18Random', lightnovelController.r18Random);
router.get('/list', userAuth, validate(lightnovelValidation.getList), lightnovelController.getList);
router.get('/like', userAuth, validate(queryValidation.queryWithOnlyPagination), lightnovelController.getLiked);
router.get('/history', userAuth, validate(queryValidation.queryWithOnlyPagination), lightnovelController.getHistory);
router.get('/directory', lightnovelController.getDirectory);
router.get('/advancedSearch', validate(lightnovelValidation.advancedSearch), lightnovelController.advancedSearch);
router.get('/admin', adminAuth, validate(queryValidation.queryWithFinding), lightnovelController.listAll);
router.get('/teamRanking/:id', validate(lightnovelValidation.teamRanking), lightnovelController.teamRanking);

router
    .route('/:id')
    .get(validate(lightnovelValidation.getInfo), lightnovelController.getInfo)
    .patch(uploaderAuth, validate(lightnovelValidation.edit), lightnovelController.edit)
    .delete(uploaderAuth, validate(lightnovelValidation.delete), lightnovelController.delete);

router
    .route('/:id/chapter')
    .get(uploaderAuth, validate(lightnovelValidation.listChapterLightnovel), lightnovelController.listChapter)

router.post('/:id/like', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), lightnovelController.like);
router.delete('/:id/unlike', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), lightnovelController.unlike);
router.post('/:id/subscribe', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), lightnovelController.subscribe);
router.delete('/:id/unsubscribe', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), lightnovelController.unsubscribe);
router.put('/:id/addToList', rateLimiter.shortSingleTimeLimiter, userAuth, validate(lightnovelValidation.addTolist), lightnovelController.addToList);
router.delete('/:id/removeFromList', rateLimiter.shortSingleTimeLimiter, userAuth, validate(queryValidation.queryWithOnlyParamId), lightnovelController.removeFromList);
router.patch('/:id/status', uploaderAuth, validate(lightnovelValidation.changeStatus), lightnovelController.changeStatus);

/**
 * @swagger
 * tags:
 *   name: Lightnovel
 *   description: API liên quan đến lightnovel
 * paths:
 *   /lightnovel:
 *     get:
 *       summary: Tìm lightnovel
 *       tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *     post:
 *       summary: Tạo lightnovel
 *       description: Cần quyền Uploader
 *       tags: [Lightnovel]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - originalName
 *                 - otherName
 *                 - description
 *                 - type
 *                 - thumbnail
 *               properties:
 *                 originalName:
 *                   type: string
 *                 otherName:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: integer
 *                 thumbnail:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum: [1,2,3,4,5,6,7]
 *                 tag:
 *                   type: string
 *                 author:
 *                   type: string
 *                 couple:
 *                   type: string
 *                 origin:
 *                   type: string
 *   /lightnovel/{id}:
 *     get:
 *       summary: Lấy thông tin lightnovel
 *       description: Nếu có đăng nhập thì có thêm phần userData
 *       tags: [Lightnovel]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: Lightnovel ID
 *     patch:
 *       summary: Sửa lightnovel
 *       description: Cần quyền Uploader hoặc Admin
 *       tags: [Lightnovel]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: Lightnovel ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - originalName
 *                 - otherName
 *                 - description
 *                 - type
 *                 - thumbnail
 *               properties:
 *                 originalName:
 *                   type: string
 *                 otherName:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: integer
 *                 thumbnail:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   enum: [1,2,3,4,5,6,7]
 *                 tag:
 *                   type: string
 *                 author:
 *                   type: string
 *                 couple:
 *                   type: string
 *                 origin:
 *                   type: string
 *     delete:
 *       summary: Xóa Lightnovel
 *       description: Cần quyền Uploader / Admin
 *       tags: [Lightnovel]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             minimum: 1
 *           description: Lightnovel ID
 * /lightnovel/latest:
 *   get:
 *     summary: Lấy lightnovel mới nhất
 *     description: Có blacklist nếu đã login... Đã block R18
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số trang
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số truyện trong 1 trang!
 * /lightnovel/latestR18:
 *   get:
 *     summary: Lấy lightnovel R18 mới nhất
 *     description: Có blacklist nếu đã login... Gỡ block với R18 (trừ khi user blacklist R18)
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số trang
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số truyện trong 1 trang!
 * /lightnovel/{id}/chapter:
 *   get:
 *     summary: Danh sách chapter của lightnovel
 *     description: Cần quyền Uploader trở lên
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Lightnovel ID
 * /lightnovel/searchByType:
 *   get:
 *     summary: Tìm lightnovel bằng thể loại
 *     description: Có blacklist
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 * /lightnovel/teamLightnovel:
 *   get:
 *     summary: Tìm lightnovel của team mình
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 * /lightnovel/teamRanking/{id}:
 *   get:
 *     summary: BXH lightnovel cho team
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Team ID hoặc Slug (url)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ['view', 'list', 'like']
 *         required: true
 * /lightnovel/ranking:
 *   get:
 *     summary: BXH lightnovel
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ['view', 'list', 'like']
 *         required: true
 * /lightnovel/r18Ranking:
 *   get:
 *     summary: BXH lightnovel R18
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ['view', 'list', 'like']
 *         required: true
 * /lightnovel/random:
 *   get:
 *     summary: Random lightnovel
 *     tags: [Lightnovel]
 * /lightnovel/r18Random:
 *   get:
 *     summary: Random lightnovel R18
 *     tags: [Lightnovel]
 * /lightnovel/list:
 *   get:
 *     summary: Lấy lightnovel trong list
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ['all', 'follow', 'done', 'stop', 'will']
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 * /lightnovel/like:
 *   get:
 *     summary: Lấy lightnovel đã like
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 * /lightnovel/history:
 *   get:
 *     summary: Lấy lịch sử đọc
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 * /lightnovel/directory:
 *   get:
 *     summary: Lấy danh sách truyện thường
 *     tags: [Lightnovel]
 * /lightnovel/admin:
 *   get:
 *     summary: Lấy danh sách truyện cho admin
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 * /lightnovel/advancedSearch:
 *   get:
 *     summary: Tìm kiếm nâng cao
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: notGenre
 *         schema:
 *           type: string
 *       - in: query
 *         name: minChapter
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *
 * /lightnovel/{id}/like:
 *   post:
 *     summary: Like lightnovel
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 * /lightnovel/{id}/unlike:
 *   delete:
 *     summary: Unlike lightnovel
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 * /lightnovel/{id}/subscribe:
 *   post:
 *     summary: Subscribe lightnovel
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 * /lightnovel/{id}/unsubscribe:
 *   delete:
 *     summary: Unsubscribe lightnovel
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 * /lightnovel/{id}/addToList:
 *   put:
 *     summary: Thêm lightnovel vào list
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listKey
 *             properties:
 *               listKey:
 *                 type: string
 *                 enum: ['follow', 'will', 'stop', 'done']
 * /lightnovel/{id}/removeFromList:
 *   delete:
 *     summary: Bỏ lightnovel ra khỏi list
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 * /lightnovel/{id}/status:
 *   patch:
 *     summary: Đổi trạng thái truyện
 *     tags: [Lightnovel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 */
module.exports = router;
