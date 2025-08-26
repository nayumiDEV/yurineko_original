import { handleActions } from 'redux-actions'
import * as actions from '../constants'
import Cookies from 'universal-cookie'
import { data } from 'autoprefixer'

const cookies = new Cookies()

const initialState = {
  auth: '',
  user: '',
  banned: false,
  notification: { data: [], unSeen: 0, hasMore: true, cursor: "" },
}

initialState.user = cookies.get('user') ?? ''

const pageReducer = handleActions(
  {
    [actions.LOGIN]: (state, action) => {
      cookies.set('user', JSON.stringify(action.payload), {
        maxAge: 60 * 60 * 24 * 10,
        sameSite: true,
        domain: 'yurineko.moe',
        path: '/',
      })
      return {
        ...state,
        banned: false,
        auth: action.payload,
      }
    },
    [actions.ACCOUNT_BANNED]: (state, action) => {
      const data = {
        reason: action.payload?.response?.data?.message?.reason,
        expireAt: action.payload?.response?.data?.message?.expireAt,
      }
      return {
        ...state,
        banned: data,
      }
    },
    [actions.LOGOUT]: (state, action) => {
      cookies.remove('user', { domain: 'yurineko.moe', path: '/' })
      return {
        ...state,
        auth: '',
        user: '',
      }
    },

    [actions.GET_PROFILE]: (state, action) => {
      return {
        ...state,
        user: { ...action.payload },
      }
    },
    [actions.GET_NOTIFICATION]: (state, action) => {
      let unSeen = 0;
      return {
        ...state,
        notification: {
          data: [...state.notification.data, ...(action.payload.data.notification || [])],
          unSeen: action.payload.data.countMissed,
          hasMore: action.payload.data.notification ? true : false,
          cursor: action.payload.data.notification ? action.payload.data.notification[action.payload.data.notification.length-1].mId : "",
        },
      }
    },
    [actions.SEEN_NOTIFICATION]: (state, action) => {
      return {
        ...state,
        notification: { ...state.notification, unSeen: 0 },
      }
    },
    [actions.READ_ALL_NOTIFICATION]: (state, action) => {
      return {
        ...state,
        notification: {
          ...state.notification,
          data: state.notification.data.map((item) => {
            return { ...item, mIsRead: true }
          }),
        },
      }
    },
  },
  initialState
)
export default pageReducer
