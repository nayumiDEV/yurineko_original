import callApi from "api";

export async function getMangaList(page = 1) {
  return callApi({ url: `/admin/manga?page=${page}`, method: "get", data: {} });
}

export async function getTeamList(page = 1) {
  return callApi({
    url: `/admin/team?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getAllTeam(query = "") {
  return callApi({
    url: `/admin/team/find?query=${query}`,
    method: "get",
    data: {},
  });
}

export async function getOriginalList(page = 1) {
  return callApi({
    url: `/admin/origin?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getUserList(page = 1) {
  return callApi({
    url: `/admin/user?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getTagList(page = 1) {
  return callApi({
    url: `/admin/tag?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getCoupleList(page = 1) {
  return callApi({
    url: `/admin/couple?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getAuthorList(page = 1) {
  return callApi({
    url: `/admin/author?page=${page}`,
    method: "get",
    data: {},
  });
}
export async function getCommentList(page = 1) {
  return callApi({
    url: `/admin/comment?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getDonateList(page = 1) {
  return callApi({
    url: `/admin/donate?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function postLogin(data) {
  return callApi({
    url: "/auth/login",
    method: "post",
    data: { ...data },
  });
}

export async function deleteData(type, id) {
  return callApi({
    url: `/admin/${type}/${id}`,
    method: "delete",
    data: {
      id,
    },
  });
}

export async function addData(type, data) {
  return callApi({
    url: `/admin/${type}`,
    method: "post",
    data: {
      ...data,
    },
  });
}

export async function editData(type, data) {
  return callApi({
    url: `/admin/${type}/${data.id}`,
    method: "patch",
    data: {
      ...data,
    },
  });
}

export async function addMemberToTeam(data) {
  return callApi({
    url: `/admin/team/add`,
    method: "post",
    data: { ...data },
  });
}

export async function removeMemberFromTeam(data) {
  return callApi({
    url: `/admin/team/remove`,
    method: "post",
    data: { ...data },
  });
}

export async function getMemberOfTeam(id) {
  return callApi({
    url: `/admin/team/${id}`,
    method: "get",
    // data: { ...data },
  });
}

export async function banUser(data) {
  return callApi({
    url: `/admin/user/ban`,
    method: "post",
    data: { ...data },
  });
}

export async function unbanUser(data) {
  return callApi({
    url: `/admin/user/ban`,
    method: "post",
    data: { ...data },
  });
}

export async function addDonate(data) {
  return callApi({
    url: `/admin/donate`,
    method: "post",
    data: { ...data },
  });
}

export async function getDashboard() {
  return callApi({
    url: "/admin/dashboard",
    method: "get",
  });
}

export async function findUser(query) {
  return callApi({
    url: `/admin/user/find?query=${query}`,
    method: "get",
  });
}

export async function adminLogin(data) {
  return callApi({
    url: "/auth/dashboardLogin",
    method: "post",
    data: { ...data },
  });
}

export async function adminUploadBanner(formData) {
  return callApi({
    url: "/admin/setting",
    method: "post",
    data: formData,
    option: { headers: { "Content-Type": "multipart/form-data" } },
  });
}
export async function findTag(query) {
  return callApi({
    url: `/tag/find?query=${query}`,
    method: "get",
  });
}

export async function findCouple(query) {
  return callApi({
    url: `/couple/find?query=${query}`,
    method: "get",
  });
}

export async function findAuthor(query) {
  return callApi({
    url: `/author/find?query=${query}`,
    method: "get",
  });
}

export async function findOrigin(query) {
  return callApi({
    url: `/origin/find?query=${query}`,
    method: "get",
  });
}

export async function findManga(query) {
  return callApi({
    url: `/uploader/manga/find?query=${query}`,
    method: "get",
  });
}

export async function setStatusManga({ id, status }) {
  return callApi({
    url: `/uploader/manga/status/${id}`,
    method: "patch",
    data: { status },
  });
}

export async function getMangaInfo(id) {
  return callApi({
    url: `/manga/${id}`,
    method: "get",
  });
}

export async function getMangaFromTeam(teamID) {
  return callApi({
    url: `/admin/team/list-manga/${teamID}`,
    method: "get",
  });
}

export async function changeOwner({ mangaID, from, to }) {
  return callApi({
    url: `/admin/team/changeOwner`,
    data: { mangaID, from, to },
    method: "post",
  });
}


export async function getNovelList({ page = 1, pageSize = 50, query = "" }) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/admin?page=${page}&pageSize=${pageSize}&query=${query}`,
    method: "get",
    data: {},
  });
}