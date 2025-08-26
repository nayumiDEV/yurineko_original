import callApi, { search, callApiWithCapcha, callLightnovelApi, callApiGateway } from 'api'
const BASE_API = process.env.BASE_API
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export async function getRanking(type) {
  return callApi({ url: `/ranking/${type}`, method: 'get', data: {} })
}

export async function login(data) {
  return callApi({ url: '/auth/login', method: 'post', data: { ...data } })
}
export async function signUp(data) {
  return callApiWithCapcha({ url: '/auth/register', method: 'post', data: { ...data } })
}

export async function getManga(id) {
  return callApi({
    url: `/manga/${id}`,
    method: 'get',
  })
}

export async function getBanner(type) {
  return callApi({
    url: `/cover/${type}`,
    method: 'get',
  })
}

export async function getNewMangaList(page = 1) {
  return callApi({
    url: `/lastest2?page=${page}`,
    method: 'get',
  })
}

export async function getRandomMangaList(page = 1) {
  return callApi({
    url: `/random?page=${page}`,
    method: 'get',
  })
}

export async function getChapterDetail({ mangaId, chapterId }) {
  return callApi({
    url: `/read/${mangaId}/${chapterId}`,
    method: 'get',
  })
}

export async function loginFB({ facebookID, accessToken }) {
  return callApi({
    url: `/auth/loginFB`,
    method: 'post',
    data: { facebookID, accessToken },
  })
}

export async function searchByKeywork(query, page = 1) {
  // return callApi({
  //   url: `/search?query=${query}`,
  //   method: 'get',
  // })
  return search(`${BASE_API}/search?query=${String(query).toLocaleLowerCase()}&page=${page}`)
}

export async function searchByKeyworkPage(query, page = 1) {
  return callApi({
    url: `/search?query=${String(query).toLocaleLowerCase()}&page=${page}`,
    method: 'get',
  })
}

export async function searchByType({ type, id }, page = 1) {
  return callApi({
    url: `/searchType?type=${type}&id=${id}&page=${page}`,
    method: 'get',
  })
}

export async function getProfile() {
  // const cookies = new Cookies()
  // const user = cookies.get('user') ?? {}

  // if (!user.username && !username) {
  //   return new Error('Unauthication!')
  // }
  return callApi({
    url: `/user/me`,
    method: 'get',
  })
}

export async function getUserProfile(username) {
  return callApi({
    url: `/profile/${username}`,
    method: 'get',
  })
}

export async function uploadCover(formData) {
  return callApi({
    url: `/user/cover`,
    data: formData,
    method: 'post',
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function uploadAvatar(formData) {
  return callApi({
    url: `/user/avatar`,
    data: formData,
    method: 'post',
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function editProfile(data) {
  return callApi({
    url: `/user/profile`,
    data: data,
    method: 'post',
  })
}

export async function editUsername(data) {
  return callApi({
    url: `/user/username`,
    data: data,
    method: 'patch',
  })
}

export async function confirmEmail(token) {
  return callApi({
    url: `/auth/confirm?token=${token}`,
    method: 'get',
  })
}

export async function addPush(data) {
  return callApiGateway({
    url: `/v1/push/endpoint`,
    data: { mData: data },
    method: 'post',
  })
}

export async function getComment({ mangaID, chapterID, page = 1 }) {
  return callApi({
    url: `/comment?mangaID=${mangaID}&chapterID=${chapterID}&page=${page}`,
    method: 'get',
  })
}

export async function postComment(formData) {
  return callApi({
    url: `/user/comment`,
    data: formData,
    method: 'post',
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function likeComment(id, type) {
  return callApi({
    url: `/user/comment/like`,
    data: { id, type },
    method: 'post',
  })
}

export async function unLikeComment(id) {
  return callApi({
    url: `/user/comment/unlike`,
    data: { id },
    method: 'post',
  })
}

export async function likeChapter(id, type) {
  return callApi({
    url: `/user/chapter/like`,
    data: { id, type },
    method: 'post',
  })
}

export async function unLikeChapter(id) {
  return callApi({
    url: `/user/chapter/unlike`,
    data: { id },
    method: 'post',
  })
}

export async function deleteComment(id) {
  return callApi({
    url: `/uploader/comment/${id}`,
    method: 'delete',
  })
}

export async function likeManga(id) {
  return callApi({
    url: `/user/manga/like`,
    data: { id },
    method: 'post',
  })
}

export async function unlikeManga(id) {
  return callApi({
    url: `/user/manga/unlike`,
    data: { id },
    method: 'post',
  })
}

export async function addToList(mangaId, listKey) {
  return callApi({
    url: `/user/yurilist`,
    data: { mangaID: mangaId, listKey },
    method: 'post',
  })
}

export async function removeFromList(mangaId, listKey) {
  return callApi({
    url: `/user/yurilist`,
    data: { mangaID: mangaId, listKey },
    method: 'delete',
  })
}

export async function changeList(mangaId, listKey, oldListKey) {
  return callApi({
    url: `/user/yurilist`,
    data: { mangaID: mangaId, listKey, oldListKey },
    method: 'patch',
  })
}

export async function getTeam(id) {
  return callApi({
    url: `/team/${id ?? ''}`,
    method: 'get',
  })
}

export async function subscribeManga(id) {
  return callApi({
    url: `/user/manga/subscribe`,
    data: { id },
    method: 'post',
  })
}

export async function unSubscribeManga(id) {
  return callApi({
    url: `/user/manga/unsubscribe`,
    data: { id },
    method: 'post',
  })
}

export async function subscribeTeam(id) {
  return callApi({
    url: `/user/team/subscribe`,
    data: { id },
    method: 'post',
  })
}

export async function unSubscribeTeam(id) {
  return callApi({
    url: `/user/team/unsubscribe`,
    data: { id },
    method: 'post',
  })
}

export async function followTeam(id) {
  return callApi({
    url: `/user/team/follow`,
    data: { id },
    method: 'post',
  })
}

export async function unFollowTeam(id) {
  return callApi({
    url: `/user/team/unfollow`,
    data: { id },
    method: 'post',
  })
}

export async function getFollowTeam() {
  return callApi({
    url: `/user/team/listFollow`,
    method: 'get',
  })
}

export async function getNotify(cursor = '') {
  return callApiGateway({
    url: `/v1/notification?cursor=${cursor}`,
    method: 'get',
  })
}

export async function seenNotify() {
  return callApiGateway({
    url: `/v1/notification/view`,
    method: 'patch',
  })
}

export async function readNotify(notificationId) {
  return callApiGateway({
    url: `/v1/notification/read/${notificationId}`,
    method: 'patch',
  })
}

export async function readAllNotify() {
  return callApiGateway({
    url: `/v1/notification/read-all`,
    method: 'patch',
  })
}

export async function getYurilist(type, page = 1) {
  // return callApi({
  //   url: ,
  //   method: 'get',
  // })
  return search(`${BASE_API}/user/list/${type}?page=${page}`)
}

export async function getHistory(page = 1) {
  return callApi({
    url: `/user/history?page=${page}`,
    method: 'get',
  })
  // return search(`${BASE_API}/user/list/${type}?page=${page}`)
}

export async function getTag(query = '') {
  return callApi({
    url: `/tag/find?query=${query}`,
    method: 'get',
  })
}
export async function getCouple(query = '') {
  return callApi({
    url: `/couple/find?query=${query}`,
    method: 'get',
  })
}
export async function getAuthor(query = '') {
  return callApi({
    url: `/author/find?query=${query}`,
    method: 'get',
  })
}
export async function getOrigin(query = '') {
  return callApi({
    url: `/origin/find?query=${query}`,
    method: 'get',
  })
}

export async function getDoujin() {
  return callApi({
    url: `/doujin`,
    method: 'get',
  })
}

export async function advSearch({ genre, notGenre, sort, minChapter, status, page = 1 }) {
  return callApi({
    url: `/advancedSearch?genre=${genre}&notGenre=${notGenre}&sort=${sort}&minChapter=${minChapter}&status=${status}&page=${page}`,
    method: 'get',
  })
}

export async function forgot(email) {
  return callApiWithCapcha({
    url: `/auth/forgot`,
    data: { email },
    method: 'post',
  })
}

export async function resetPw({ token, password }) {
  return callApi({
    url: `/auth/resetPwd`,
    data: { token, password },
    method: 'post',
  })
}

export async function getBlackListTag() {
  return callApi({
    url: `/user/blacklist`,
    method: 'get',
  })
}

export async function addBlackListTag(id) {
  return callApi({
    url: `/user/blacklist`,
    data: { tagID: id },
    method: 'post',
  })
}

export async function deleteBlackListTag(id) {
  return callApi({
    url: `/user/blacklist/${id}`,
    method: 'delete',
  })
}

export async function changePassword({ oldPass, password }) {
  return callApi({
    url: `/user/changePassword`,
    data: { oldPass, password },
    method: 'patch',
  })
}

export async function getUserPreference() {
  return callApiGateway({
    url: `/v1/user-preference`,
    method: 'get',
  })
}

export async function setUserPreference({ ...data }) {
  return callApiGateway({
    url: `/v1/user-preference`,
    data: data,
    method: 'patch',
  })
}

export async function getNewR18MangaList(page = 1) {
  return callApi({
    url: `/r18Lastest?page=${page}`,
    method: 'get',
  })
}

export async function getR18Random(page = 1) {
  return callApi({
    url: `/r18Random?page=${page}`,
    method: 'get',
  })
}

export async function getR18Ranking(type) {
  return callApi({ url: `/r18Ranking/${type}`, method: 'get', data: {} })
}

export async function deposit(money) {
  return callApiWithCapcha({
    url: '/user/order',
    data: { money },
    method: 'post',
  })
}

export async function report({ chapterID, mangaID, type, detail }) {
  return callApiWithCapcha({
    url: '/user/report',
    data: { chapterID, mangaID, type, detail },
    method: 'post',
  })
}

export async function getPremium() {
  return callApi({
    url: '/premium',
    method: 'get',
  })
}

export async function regPremium({ planID }) {
  return callApiWithCapcha({
    url: '/user/premium',
    data: { planID },
    method: 'post',
  })
}

export async function getCoupleDirectory() {
  return callApi({
    url: '/directory/couple',
    method: 'get',
  })
}

export async function getFavorite(page = 1) {
  return callApi({
    url: `/user/like?page=${page}`,
    method: 'get',
  })
}

export async function getOriginalDirectory(page = 1) {
  return callApi({
    url: `/directory/general?page=${page}`,
    method: 'get',
  })
}

export async function searchLnByType({ type, id }, page = 1) {
  return callLightnovelApi({
    url: `/lightnovel/searchByType?type=${type}&query=${id}&page=${page}`,
    method: 'GET',
  })
}

export async function getTeamMangaRanking(type, teamId) {
  return callApi({
    url: `/team/${teamId}/rank?type=${type}`,
    method: 'GET',
  })
}

export async function getTeamLightnovelRanking(type, teamId) {
  return callLightnovelApi({
    url: `/lightnovel/teamRanking/${teamId}?type=${type}`,
    method: 'GET',
  })
}

export async function getChapterReaction(id, type, page = 1, size = 20) {
  return callApi({
    url: `/user/chapter/${id}/reaction?type=${type}&page=${page}&pageSize=${size}`,
    method: 'GET',
  })
}

export async function getCommentReaction(id, type, page = 1, size = 20) {
  return callApi({
    url: `/user/comment/${id}/reaction?type=${type}&page=${page}&pageSize=${size}`,
    method: 'GET',
  })
}

export async function pinComment(id) {
  return callApi({
    url: `/uploader/comment/${id}/pin`,
    method: 'patch',
  })
}

export async function banUser(data) {
  return callApi({
    url: `/admin/user/ban`,
    method: 'post',
    data: { ...data },
  })
}

export async function createCommentV1(data) {
  return callApi({
    url: `/v1/comment`,
    method: 'post',
    data: { ...data },
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function getCommentV1({ mangaID, chapterID, page = 1 }) {
  return callApi({
    url: `/v1/comment?mangaId=${mangaID}${
      chapterID != null ? `&chapterId=${chapterID}` : ''
    }&page=${page}`,
    method: 'get',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function getHighlightComments(commentID) {
  return callApi({
    url: `/v1/comment/highlight?commentId=${commentID}`,
    method: 'get',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function getSubCommentV1({ commentID, cursor = null }) {
  return callApi({
    url: `/v1/comment/${commentID}?cursor=${cursor}`,
    method: 'get',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function deleteCommentV1({ commentID }) {
  return callApi({
    url: `/v1/comment/${commentID}`,
    method: 'delete',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function getCommentReactionV1({ commentID, type, page = 1, size }) {
  return callApi({
    url: `/v1/comment/${commentID}/reaction-count?type=${type}&page=${page}&pageSize=${size}`,
    method: 'get',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function toggleCommentReactionV1({ commentID, type }) {
  return callApi({
    url: `/v1/comment/${commentID}/reaction`,
    method: 'post',
    data: { type },
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function pinCommentV1({ commentID }) {
  return callApi({
    url: `/v1/comment/${commentID}/pin`,
    method: 'patch',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function uploadImage(formData) {
  return callApi({
    url: `/user/image`,
    method: 'post',
    data: formData,
    option: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    // baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function updateCommentV1({ commentID, data }) {
  return callApi({
    url: `/v1/comment/${commentID}`,
    method: 'patch',
    data: data,
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function getCommentEditHistoryV1({ commentID }) {
  return callApi({
    url: `/v1/comment/${commentID}/edit-history`,
    method: 'get',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}

export async function getMentionSearchAhead({ query }) {
  return callApiGateway({
    url: `/v1/comment/mention-search-ahead?q=${query}`,
    method: 'get',
    baseUrl: process.env.BASE_API_COMMENT,
  })
}
