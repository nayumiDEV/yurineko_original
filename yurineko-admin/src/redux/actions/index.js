import { createAction } from "redux-actions";
import * as constants from "../constants";
import * as api from "api/admin";
import { message } from "antd";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getMangaListSuccess = createAction(constants.ADMIN_GET_MANGALIST);
export const getOriginalListSuccess = createAction(
  constants.ADMIN_GET_ORIGINAL
);
export const getTeamListSuccess = createAction(constants.ADMIN_GET_TEAMLIST);
export const getUserListSuccess = createAction(constants.ADMIN_GET_USERLIST);
export const getTagListSuccess = createAction(constants.ADMIN_GET_TAGLIST);
export const getCoupleListSuccess = createAction(
  constants.ADMIN_GET_COUPLELIST
);
export const getAuthorListSuccess = createAction(
  constants.ADMIN_GET_AUTHORLIST
);
export const getCommentListSuccess = createAction(
  constants.ADMIN_GET_COMMENTLIST
);
export const getDonateListSuccess = createAction(
  constants.ADMIN_GET_DONATELIST
);
export const getDashboardSuccess = createAction(constants.ADMIN_GET_DASHBOARD);
export const adminLoginSuccess = createAction(constants.ADMIN_POST_LOGIN);
export const adminLoginFailed = createAction(constants.ADMIN_POST_LOGIN_FAIL);
export const adminLogout = createAction(constants.ADMIN_LOGOUT);
export const getListNovelSuccess = createAction(constants.UPLOAD_GET_NOVELLIST);


export const setLoading = createAction(constants.SET_LOADING);
export const offLoading = createAction(constants.OFF_LOADING);

export const test = createAction(constants.TEST);

const errorCode = {
  logout: [401, 403],
  serverError: [500],
};
export const handleErr = (err) => {
  return async (dispatch) => {
    try {
      const { status } = err.response;
      const msg =
        err && err.response ? err.response.data.message : "Có lỗi xảy ra";
      dispatch(offLoading());
      message.error(msg);

      if (errorCode.logout.indexOf(status) > -1) {
        localStorage.removeItem("admin");
        cookies.remove("admin");
        dispatch(adminLogout());
      }
    } catch (e) {
      console.log(e);
      message.error("Có lỗi xảy ra");
    }
  };
};

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

export const getOriginalList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const mangaList = await api.getOriginalList(page);
      dispatch(getOriginalListSuccess(mangaList));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getTeamList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getTeamList(page);
      dispatch(getTeamListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getUserList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getUserList(page);
      dispatch(getUserListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getTagList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getTagList(page);
      dispatch(getTagListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getCoupleList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getCoupleList(page);
      dispatch(getCoupleListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};
export const getAuthorList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getAuthorList(page);
      dispatch(getAuthorListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const getCommentList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getCommentList(page);
      dispatch(getCommentListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};
export const getDonateList = (page) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await api.getDonateList(page);
      dispatch(getDonateListSuccess(data));
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(handleErr(err));
    }
  };
};

export const delData = ({ type, id }, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    api
      .deleteData(type, id)
      .then(() => {
        message.success("Xóa thành công");
        callback();
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const addData = ({ type, data }, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    api
      .addData(type, data)
      .then(() => {
        message.success("Thêm thành công");
        callback();
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const editData = ({ type, data }, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    api
      .editData(type, data)
      .then(() => {
        message.success("Thêm thành công");
        callback();
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const addMemberToTeam = (data, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    api
      .addMemberToTeam(data)
      .then(() => {
        message.success("Thêm thành công");
        callback();
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const removeMemberFromTeam = ({ id }, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    api
      .removeMemberFromTeam({ id })
      .then(() => {
        message.success("Xóa thành công");
        callback();
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const banUser = (data, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    if (data.time != 0) {
      api
        .banUser(data)
        .then(() => {
          message.success("Ban thành công");
          callback();
        })
        .catch((err) => {
          dispatch(handleErr(err));
          callback();
        });
    } else {
      api
        .unbanUser(data)
        .then(() => {
          callback();

          message.success("UnBan thành công");
        })
        .catch((err) => {
          dispatch(handleErr(err));
          callback();
        });
    }

    dispatch(setLoading(false));
  };
};

export const addDonate = (data, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    api
      .addDonate(data)
      .then(() => {
        message.success("Thêm thành công");
        callback();
      })
      .catch((err) => dispatch(handleErr(err)));
    dispatch(setLoading(false));
  };
};

export const getDashboard = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    await api
      .getDashboard()
      .then((res) => {
        dispatch(getDashboardSuccess(res));
      })
      .catch((err) => dispatch(handleErr(err)));
    dispatch(setLoading(false));
  };
};

export const adminLogin = (data) => {
  message.info("Logging...");
  return async (dispatch) => {
    dispatch(setLoading(true));
    await api
      .adminLogin(data)
      .then((res) => {
        dispatch(adminLoginSuccess(res));
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const adminUploadBanner = (formData) => {
  message.info("Uploading...");
  return async (dispatch) => {
    dispatch(setLoading(true));
    await api
      .adminUploadBanner(formData)
      .then((res) => {
        dispatch(setLoading(false));
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
  };
};

export const setStatusManga = ({ id, status }, callback) => {
  message.info("Uploading...");
  return async (dispatch) => {
    dispatch(setLoading(true));
    await api
      .setStatusManga({ id, status })
      .then((res) => {
        dispatch(setLoading(false));
        callback();
      })
      .catch((err) => {
        dispatch(handleErr(err));
      });
    dispatch(setLoading(false));
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