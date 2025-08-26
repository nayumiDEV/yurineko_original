import callApi from 'api'

export async function getMangaList(page = 1) {
  return callApi({ url: `/uploader/manga?page=${page}`, method: 'get', data: {} })
}

export async function createManga(formData) {
  return callApi({
    url: '/uploader/manga',
    method: 'post',
    data: formData,
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function delManga(id) {
  return callApi({
    url: `/uploader/manga/${id}`,
    method: 'delete',
  })
}

export async function editManga(id, formData) {
  return callApi({
    url: `/uploader/manga/${id}`,
    method: 'patch',
    data: formData,
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function addChapter(formData, setProgress) {
  return callApi({
    url: `/uploader/chapter`,
    method: 'post',
    data: formData,
    option: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    config: {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100
        setProgress(progress)
      },
    },
  })
}

export async function getChapterList(id) {
  return callApi({
    url: `/uploader/chapterlist/${id}`,
    method: 'get',
  })
}

export async function editChapter(id, formData, setProgress) {
  return callApi({
    url: `/uploader/chapter/${id}`,
    method: 'patch',
    data: formData,
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
    config: {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100
        setProgress(progress)
      },
    },
  })
}

export async function deleteChapter(id) {
  return callApi({
    url: `/uploader/chapter/${id}`,
    method: 'delete',
  })
}

export async function getAllComments(page = 1) {
  return callApi({
    url: `/uploader/comment?page=${page}`,
    method: 'get',
    data: {},
  })
}

export async function getAllReport(page = 1) {
  return callApi({
    url: `/uploader/report?page=${page}`,
    method: 'get',
    data: {},
  })
}

export async function updateTeamProfile(formData) {
  return callApi({
    url: `/uploader/profile`,
    method: 'post',
    data: formData,
    option: { headers: { 'Content-Type': 'multipart/form-data' } },
  })
}

export async function getTeamProfile() {
  return callApi({
    url: `/uploader/profile`,
    method: 'get',
  })
}

export async function deleteComment(id) {
  return callApi({
    url: `/uploader/comment/${id}`,
    method: 'delete',
  })
}
