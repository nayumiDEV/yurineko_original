import callApi, { search, callApiWithCapcha } from 'api'
const BASE_API = process.env.BASE_API
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export async function getRanking(type) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/ranking?type=${type}`,
    method: 'get',
    data: {},
  })
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
    url: `/latest2?page=${page}`,
    method: 'get',
  })
}

export async function getRandomMangaList(page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/random`,
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
  return search(
    `${process.env.BASE_URL_LN}/lightnovel?query=${String(query).toLocaleLowerCase()}&page=${page}`
  )
}

export async function searchByKeyworkPage(query, page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel?query=${String(
      query
    ).toLocaleLowerCase()}&page=${page}`,
    method: 'get',
  })
}

export async function searchByType({ type, id }, page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/searchByType?type=${type}&query=${id}&page=${page}`,
    method: 'get',
  })
}

export async function searchMangaByType({ type, id }, page = 1) {
  return callApi({
    url: `https://api.yurineko.moe/searchType?type=${type}&id=${id}&page=${page}`,
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
  return callApi({
    url: `/profile/pushNotify`,
    data: { pushData: data },
    method: 'post',
  })
}

export async function getComment({ mangaID, chapterID, page = 1 }) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/comment?lightnovelID=${mangaID}&chapterID=${chapterID}&page=${page}`,
    method: 'get',
  })
}

export async function postComment(formData) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/comment`,
    data: formData,
    method: 'post',
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function likeComment(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/comment/${id}/like`,
    method: 'post',
  })
}

export async function unLikeComment(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/comment/${id}/unlike`,
    method: 'delete',
  })
}

export async function deleteComment(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/comment/${id}`,
    method: 'delete',
  })
}

export async function likeManga(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/${id}/like`,
    method: 'post',
  })
}

export async function unlikeManga(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/${id}/unlike`,
    method: 'delete',
  })
}

export async function addToList(mangaId, listKey) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/${mangaId}/addToList`,
    data: { listKey },
    method: 'put',
  })
}

export async function removeFromList(mangaId, listKey) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/${mangaId}/removeFromList`,
    method: 'delete',
  })
}

export async function changeList(mangaId, listKey, oldListKey) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/${mangaId}/addToList`,
    data: { listKey },
    method: 'put',
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
    url: `${process.env.BASE_URL_LN}/lightnovel/${id}/subscribe`,
    method: 'post',
  })
}

export async function unSubscribeManga(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/${id}/unsubscribe`,
    data: { id },
    method: 'delete',
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

export async function likeChapter(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/chapter/${id}/like`,
    method: 'post',
  })
}

export async function unlikeChapter(id) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/chapter/${id}/unlike`,
    method: 'delete',
  })
}

export async function getFollowTeam() {
  return callApi({
    url: `/user/team/listFollow`,
    method: 'get',
  })
}

export async function getNotify(page = 1) {
  return callApi({
    url: `/user/notification?page=${page}`,
    method: 'get',
  })
}

export async function readNotify(notificationId) {
  return callApi({
    url: `/user/notification/${notificationId}/read`,
    method: 'patch',
  })
}

export async function readAllNotify() {
  return callApi({
    url: `/user/notification/readAll`,
    method: 'patch',
  })
}


export async function seenNotify() {
  return callApi({
    url: `/user/notification/seen`,
    method: 'get',
  })
}

export async function getYurilist(type, page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/list?type=${type}&page=${page}`,
    method: 'get',
  })
}

export async function getHistory(page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/history?page=${page}`,
    method: 'get',
  })
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
    url: `${process.env.BASE_URL_LN}/lightnovel/advancedSearch?genre=${genre}&notGenre=${notGenre}&sort=${sort}&minChapter=${minChapter}&status=${status}&page=${page}`,
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

export async function getNotificationConfig() {
  return callApi({
    url: `/user/notificationOption`,
    method: 'get',
  })
}

export async function setNotificationConfig({ ...data }) {
  return callApi({
    url: `/user/notificationOption`,
    data: data,
    method: 'patch',
  })
}

export async function getNewR18MangaList(page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/latestR18?page=${page}`,
    method: 'get',
  })
}

export async function getR18Random(page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/r18Random`,
    method: 'get',
  })
}

export async function getR18Ranking(type) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/r18Ranking?type=${type}`,
    method: 'get',
    data: {},
  })
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
    url: `${process.env.BASE_URL_LN}/report`,
    data: { chapterId: chapterID, lightnovelId: mangaID, type, detail },
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
    url: `${process.env.BASE_URL_LN}/lightnovel/like?page=${page}`,
    method: 'get',
  })
}

export async function getOriginalDirectory() {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/directory`,
    method: 'get',
  })
}

export async function getNewNovelList(page = 1) {
  return callApi({
    url: `${process.env.BASE_URL_LN}/lightnovel/latest?page=${page}`,
    method: 'get',
  })
}

export async function getTeamMangaRanking(type, teamId){
  return callApi({
    url:`https://api.yurineko.moe/team/${teamId}/rank?type=${type}`,
    method: 'GET'
  })
}

export async function getTeamLightnovelRanking(type, teamId){
  return callApi({
    url:`${process.env.BASE_URL_LN}/lightnovel/teamRanking/${teamId}?type=${type}`,
    method: 'GET'
  })
}