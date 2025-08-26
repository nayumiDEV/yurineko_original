const express = require('express');

const router = express.Router();
const upload = require("../../helpers/upload");
const chapterUploadMiddleware = upload.array("chapter");
const mangaUploadMiddleware = upload.single("thumbnail");

/*             CONTROLLERS            */
const manga = require('../../controllers/uploader/manga');
const chapter = require('../../controllers/uploader/chapter');
const comment = require('../../controllers/uploader/comment');
const report = require('../../controllers/uploader/report');
const profileTeam = require('../../controllers/uploader/profileTeam');
const temporaryImageUpload = require('../../controllers/image');

const profileTeamEditMiddleware = upload.fields([
    {
        name: 'cover',
        maxCount: 1
    },
    {
        name: 'avatar',
        maxCount: 1
    }
])
router.get('/profile', profileTeam.info);
router.post('/profile', profileTeamEditMiddleware, profileTeam.edit);

/*               MANGA                 */
router.get('/manga', manga.list);
router.get('/manga/find', manga.find);
router.get('/manga/:id', manga.info);
router.get('/chapterlist/:id', manga.chapterList);
router.post('/manga', mangaUploadMiddleware, manga.add);
router.patch('/manga/status/:id', manga.editStatus)
router.patch('/manga/:id', mangaUploadMiddleware, manga.edit);
router.delete('/manga/:id', manga.delete);

/*              CHAPTER                 */
router.post('/chapter', chapterUploadMiddleware, chapter.add);
router.patch('/chapter/:id', chapterUploadMiddleware, chapter.edit);
router.delete('/chapter/:id', chapter.delete);

/*              COMMENT                 */
router.get('/comment', comment.get);
router.patch('/comment/:id/pin', comment.pin);
router.delete('/comment/:id', comment.delete);
router.get('/report', report.list);

const uploadThumbnailUploadMiddleware = upload.single('image');

router.post('/image', uploadThumbnailUploadMiddleware, temporaryImageUpload)

module.exports = router;
