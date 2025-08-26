import { handleActions } from 'redux-actions'
import * as actions from '../constants'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const initialState = { auth: '', user: '', notification: { data: [], unSeen: 0, hasMore: true, currentPage : 0 } }

initialState.user = cookies.get('user') ?? ''

const pageReducer = handleActions(
  {
    [actions.LOGIN]: (state, action) => {
      cookies.set('user', JSON.stringify(action.payload), {
        maxAge: 60 * 60 * 24 * 10,
        sameSite: true,
        domain: 'yurineko.moe',
        path: '/'
      })
      return {
        ...state,
        auth: action.payload,
      }
    },
    [actions.LOGOUT]: (state, action) => {
      cookies.remove(
        'user',
        { domain: "yurineko.moe", path: '/' }
      )
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
      let unSeen = 0
      action.payload.data.forEach((item) => {
        if (item.isView == false) unSeen = unSeen + 1
      })
      return {
        ...state,
        notification: { data: [...state.notification.data, ...action.payload.data], unSeen: unSeen, hasMore: action.payload.data.length != 0, currentPage : action.payload.page },
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
        notification: { ...state.notification, data: state.notification.data.map(item => { return { ...item, isRead: 1 } }) },
      }
    },
  },
  initialState
)
export default pageReducer
