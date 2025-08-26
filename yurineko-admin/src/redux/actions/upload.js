import { createAction } from "redux-actions";
import * as constants from "../constants";
import * as api from "api/uploader";
import { setLoading, handleErr } from "./index";
import { message } from "antd";
import _ from "lodash";

const getMangaListSuccess = createAction(constants.UPLOAD_GET_MANGALIST);
const createMangaSuccess = createAction(constants.UPLOAD_CREATE_MANGA);
const editMangaSuccess = createAction(constants.UPLOAD_EDIT_MANGA);
const getCommentListSuccess = createAction(constants.UPLOAD_GET_COMMENTLIST);
const getReportSuccess = createAction(constants.UPLOAD_GET_REPORT);
export const initEditor = createAction(constants.UPLOAD_INIT_EDITOR);
export const updateEditor = createAction(constants.UPLOAD_UPDATE_EDITOR);
const createNovelChapterSuccess = createAction(constants.CREATE_NOVEL_CHAPTER);
const saveNovelChapterSuccess = createAction(constants.SAVE_NOVEL_CHAPTER);
const getListNovelSuccess = createAction(constants.UPLOAD_GET_NOVELLIST);

export const getMangaList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const mangaList = await api.getMangaList(page);
      dispatch(getMangaListSuccess(mangaList));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const createManga = (data, callback) => {
  return async (dispatch) => {
    try {
      message.loading("Uploading...");
      dispatch(setLoading(true));
      const res = await api.createManga(data);
      dispatch(createMangaSuccess(res));
      dispatch(setLoading(false));
      message.success("Thêm thành công");
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const editManga = (id, data, callback) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.editManga(id, data);
      dispatch(editMangaSuccess(res));
      dispatch(setLoading(false));
      message.success("Sửa thành công!");
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const delManga = (id, callback) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.delManga(id);
      dispatch(setLoading(false));
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const addChapter = (formData, callback, setProgress) => {
  return async (dispatch) => {
    try {
      message.loading("Uploading...");
      dispatch(setLoading(true));
      const res = await api.addChapter(formData, setProgress);
      dispatch(createMangaSuccess(res));
      dispatch(setLoading(false));
      message.success("Thêm thành công");
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const editChapter = ({ id, formData }, callback, setProgress) => {
  return async (dispatch) => {
    try {
      message.loading("Uploading...");
      dispatch(setLoading(true));
      const res = await api.editChapter(id, formData, setProgress);
      // dispatch(createMangaSuccess(res))
      dispatch(setLoading(false));
      message.success("Sửa thành công");
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getCommentList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getAllComments(page);
      dispatch(getCommentListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getCommentListNovel = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getAllCommentsNovel(page);
      dispatch(getCommentListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getFeedbackList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getAllReport(page);
      dispatch(getReportSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const createNovelChapter = ({ chapterId, lightnovelId, ...data }) => {
  return async (dispatch) => {
    console.log("chapterid:", chapterId);
    console.log("data", data);
    try {
      if (!data.name || _.isEmpty(data.content) || !lightnovelId)
        return message.error("Các trường chưa được nhập đầy đủ!");
      message.loading("Uploading...");
      dispatch(setLoading(true));
      if (chapterId) {
        // save chapter
        const res = await api.editNovelChapter(chapterId, data);
        dispatch(saveNovelChapterSuccess(res));
      } else {
        // create chapter
        const res = await api.createNovelChapter({ ...data, lightnovelId });
        dispatch(createNovelChapterSuccess(res.chapterId));
      }
      dispatch(setLoading(false));
      message.success("Lưu thành công!");
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const createNovel = (data, callback) => {
  return async (dispatch) => {
    try {
      message.loading("Uploading...");
      dispatch(setLoading(true));
      const res = await api.createNovel(data);
      dispatch(setLoading(false));
      message.success("Thêm thành công");
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const editNovel = (id, data, callback) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.editNovel(id, data);
      dispatch(setLoading(false));
      message.success("Sửa thành công!");
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getNovelList = ({ page }) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const list = await api.getNovelList({ page });
      dispatch(getListNovelSuccess(list));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getNovelChapterInfo = (novelId, chapterId) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.getNovelChapterInfo(chapterId);
      dispatch(updateEditor(res));
      dispatch(setLoading(false));
      return res;
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const delNovel = (id, callback) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.delNovel(id);
      dispatch(setLoading(false));
      callback();
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const changeStatusNovel = (id, data) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await api.changeStatusNovel(id, data);
      dispatch(setLoading(false));
      message.success("Cập nhật thành công!");
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getFeedbackListNovel = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getAllReportNovel(page);
      dispatch(getReportSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};
