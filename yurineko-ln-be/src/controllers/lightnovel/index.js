const createLightnovel = require('./create');
const editLightnovel = require('./edit');
const deleteLightnovel = require('./delete');
const lastestLightnovel = require('./latest');
const lastestLightnovelR18 = require('./latestR18');
const getInfoLightnovel = require('./get');
const listChapterLightnovel = require('./listChapter');
const searchLightnovelByType = require('./searchByType');
const teamLightnovel = require('./teamLightnovel');
const teamRankingLightnovel = require('./teamRanking');
const rankingLightnovel = require('./ranking');
const r18RankingLightnovel = require('./rankingR18');
const randomLightnovel = require('./random');
const r18RandomLightnovel = require('./randomR18');
const likeLightnovel = require('./like');
const unlikeLightnovel = require('./unlike');
const subscribeLightnovel = require('./subscribe');
const unsubscribeLightnovel = require('./unsubscribe');
const getListLightnovel = require('./getList');
const getLikedLightnovel = require('./getLiked');
const addLightnovelToList = require('./addToList');
const removeLightnovelFromList = require('./removeFromList');
const changeLightnovelStatus = require('./changeStatus');
const searchLightnovelByName = require('./searchByName');
const getHistory = require('./history');
const getDirectory = require('./directory');
const advancedSearch = require('./advancedSearch');
const listAllLightnovel = require('./listAll');

// lightnovel
module.exports = {
    create: createLightnovel,
    edit: editLightnovel,
    delete: deleteLightnovel,
    lastest: lastestLightnovel,
    lastestR18: lastestLightnovelR18,
    getInfo: getInfoLightnovel,
    listChapter: listChapterLightnovel,
    searchLightnovelByType,
    teamLightnovel,
    teamRanking: teamRankingLightnovel,
    rank: rankingLightnovel,
    r18Ranking: r18RankingLightnovel,
    random: randomLightnovel,
    r18Random: r18RandomLightnovel,
    like: likeLightnovel,
    unlike: unlikeLightnovel,
    subscribe: subscribeLightnovel,
    unsubscribe: unsubscribeLightnovel,
    getList: getListLightnovel,
    addToList: addLightnovelToList,
    removeFromList: removeLightnovelFromList,
    getLiked: getLikedLightnovel,
    changeStatus: changeLightnovelStatus,
    searchByName: searchLightnovelByName,
    getHistory,
    getDirectory,
    advancedSearch,
    listAll: listAllLightnovel
}
