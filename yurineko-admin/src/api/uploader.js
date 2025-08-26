import callApi from "api";

export async function getMangaList(page = 1) {
  return callApi({
    url: `/uploader/manga?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function createManga(formData) {
  return callApi({
    url: "/uploader/manga",
    method: "post",
    data: formData,
    option: { headers: { "Content-Type": "multipart/form-data" } },
  });
}

export async function delManga(id) {
  return callApi({
    url: `/uploader/manga/${id}`,
    method: "delete",
  });
}

export async function editManga(id, formData) {
  return callApi({
    url: `/uploader/manga/${id}`,
    method: "patch",
    data: formData,
    option: { headers: { "Content-Type": "multipart/form-data" } },
  });
}

export async function addChapter(formData, setProgress) {
  return callApi({
    url: `/uploader/chapter`,
    method: "post",
    data: formData,
    option: {
      headers: { "Content-Type": "multipart/form-data" },
    },
    config: {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setProgress(progress);
      },
    },
  });
}

export async function getChapterList(id) {
  return callApi({
    url: `/uploader/chapterlist/${id}`,
    method: "get",
  });
}

export async function editChapter(id, formData, setProgress) {
  return callApi({
    url: `/uploader/chapter/${id}`,
    method: "patch",
    data: formData,
    option: { headers: { "Content-Type": "multipart/form-data" } },
    config: {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setProgress(progress);
      },
    },
  });
}

export async function deleteChapter(id) {
  return callApi({
    url: `/uploader/chapter/${id}`,
    method: "delete",
  });
}

export async function getAllComments(page = 1) {
  return callApi({
    url: `/uploader/comment?page=${page}`,
    method: "get",
    data: {},
  });
}


export async function getAllCommentsNovel(page = 1) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/comment/all?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function getAllReport(page = 1) {
  return callApi({
    url: `/uploader/report?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function updateTeamProfile(formData) {
  return callApi({
    url: `/uploader/profile`,
    method: "post",
    data: formData,
    option: { headers: { "Content-Type": "multipart/form-data" } },
  });
}

export async function getTeamProfile() {
  return callApi({
    url: `/uploader/profile`,
    method: "get",
  });
}

export async function deleteComment(id) {
  return callApi({
    url: `/uploader/comment/${id}`,
    method: "delete",
  });
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return callApi({
    url: "https://api.yurineko.moe/uploader/image",
    method: "post",
    data: formData,
    option: { headers: { "Content-Type": "multipart/form-data" } },
  });
}

export async function createNovelChapter(data) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/chapter`,
    method: "post",
    data: data,
  });
}

export async function editNovelChapter(id, data) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/chapter/${id}`,
    method: "patch",
    data: data,
  });
}

export async function createNovel(data) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel`,
    method: "post",
    data: data,
  });
}

export async function editNovel(id, data) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/${id}`,
    method: "patch",
    data: data,
  });
}

export async function getNovelList({ page = 1, pageSize = 50, query = "" }) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/teamLightnovel?page=${page}&pageSize=${pageSize}&query=${query}`,
    method: "get",
    data: {},
  });
}

export async function getNovelInfo(id) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/${id}`,
    method: "get",
    data: {},
  });
}

export async function getNovelChapterList(id) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/${id}/chapter`,
    method: "get",
  });
}

export async function getNovelChapterInfo(id) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/chapter/fullInfo/${id}`,
    method: "get",
  });
}

export async function deleteNovelChapter(id) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/chapter/${id}`,
    method: "delete",
  });
}

export async function delNovel(id) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/${id}`,
    method: "delete",
  });
}

export async function changeStatusNovel(id, data) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/lightnovel/${id}/status`,
    method: "patch",
    data: data,
  });
}

export async function getAllReportNovel(page = 1) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/report?page=${page}`,
    method: "get",
    data: {},
  });
}

export async function swapChapterOrder(id, sequence) {
  return callApi({
    url: `${process.env.REACT_APP_LN_API}/chapter/${id}/sequence`,
    method: "patch",
    data: { sequence },
  });
}
