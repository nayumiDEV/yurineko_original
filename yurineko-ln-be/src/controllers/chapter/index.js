const createChapter = require('./create');
const editChapter = require('./edit');
const deleteChapter = require('./delete');
const readChapter = require('./read');
const likeChapter = require('./like');
const unlikeChapter = require('./unlike');
const getChapterInfoForEdit = require('./getInfoForEdit');
const changeSequence = require('./changeSequence');

module.exports = {
    create: createChapter,
    edit: editChapter,
    delete: deleteChapter,
    getChapterInfoForEdit,
    read: readChapter,
    like: likeChapter,
    unlike: unlikeChapter,
    changeSequence
}