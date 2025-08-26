import { createAction } from 'redux-actions'
import * as constants from '../constants'
import * as api from '../../../api/general'
import { message } from 'antd'
import cookies from 'js-cookie'

export const setLoading = createAction(constants.SET_LOADING)
export const offLoading = createAction(constants.OFF_LOADING)

export const getRankSuccess = createAction(constants.GET_RANK)
export const loginSuccess = createAction(constants.LOGIN)
export const signUpSuccess = createAction(constants.SIGNUP)
export const logoutRedux = createAction(constants.LOGOUT)
export const getNewMangaSuccess = createAction(constants.GET_NEW_MANGA)
export const getProfileSuccess = createAction(constants.GET_PROFILE)
export const getNotificationSuccess = createAction(constants.GET_NOTIFICATION)
export const readAllNotificationSuccess = createAction(constants.READ_ALL_NOTIFICATION)
export const seenNotificationSuccess = createAction(constants.SEEN_NOTIFICATION)
export const getR18RankSuccess = createAction(constants.GET_R18_RANK)
export const getNewR18MangaSuccess = createAction(constants.GET_NEW_R18_MANGA)

const errorCode = {
  logout: [401, 403],
  serverError: [500],
}
export const handleErr = (err) => {
  return async (dispatch) => {
    dispatch(offLoading())
    try {
      const { status } = err.response
      const msg = err && err.response ? err.response.data.message : 'Có lỗi xảy ra'
      message.error(msg, 0.5)

      if (errorCode.logout.indexOf(status) > -1) {
        localStorage.removeItem('user')
        // cookies.remove('user')
        dispatch(logout())
      }
    } catch {
      message.error('Có lỗi xảy ra', 0.5)
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    // console.log('thong bao')
    cookies.remove('user')
    await dispatch(logoutRedux())
    window.location.reload()
    // cookie

    // window.location.reload()
  }
}

export const getRank = () => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .getRanking()
      .then((res) => {
        dispatch(getRankSuccess(res))
        dispatch(setLoading(false))
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}

export const login = (data) => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .login(data)
      .then((res) => {
        dispatch(loginSuccess(res))
        dispatch(setLoading(false))
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}

export const signUp = (data, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .signUp(data)
      .then((res) => {
        dispatch(signUpSuccess(res))
        callback()
        dispatch(setLoading(false))
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}

export const loginFB = (data) => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .loginFB(data)
      .then((res) => {
        dispatch(loginSuccess(res))
        // callback()
        dispatch(setLoading(false))
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}

export const getNewMangaList = (page, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .getNewNovelList(page)
      .then((res) => {
        dispatch(getNewMangaSuccess({ ...res, page }))
        dispatch(setLoading(false))
        callback()
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}

export const getProfile = (username, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .getProfile()
      .then((res) => {
        dispatch(getProfileSuccess(res))
        dispatch(setLoading(false))
      })
      .catch((err) => {
        if (err.message == 'Unauthication!') {
          dispatch(logout())
        }
        dispatch(handleErr(err))
      })
  }
}

export const getNotification = (page = 1) => {
  return async (dispatch) => {
    api
      .getNotify(page)
      .then((res) => {
        dispatch(getNotificationSuccess({ data: res, page }))
      })
      .catch((err) => {
        dispatch(handleErr(err))
      })
  }
}

export const seenNotification = () => {
  return async (dispatch) => {
    api
      .seenNotify()
      .then((res) => {
        dispatch(seenNotificationSuccess(res))
      })
      .catch((err) => {
        dispatch(handleErr(err))
      })
  }
}

export const readAllNotification = () => {
  return async (dispatch) => {
    api
      .readAllNotify()
      .then((res) => {
        dispatch(readAllNotificationSuccess(res))
      })
      .catch((err) => {
        dispatch(handleErr(err))
      })
  }
}

export const getR18Rank = () => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .getR18Ranking()
      .then((res) => {
        dispatch(getR18RankSuccess(res))
        dispatch(setLoading(false))
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}

export const getNewR18MangaList = (page, callback) => {
  return async (dispatch) => {
    dispatch(setLoading(true))
    api
      .getNewR18MangaList(page)
      .then((res) => {
        dispatch(getNewR18MangaSuccess({ ...res, page }))
        dispatch(setLoading(false))
        callback()
      })
      .catch((err) => dispatch(handleErr(err)))
  }
}


