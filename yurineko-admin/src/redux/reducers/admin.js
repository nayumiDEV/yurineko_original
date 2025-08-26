import { handleActions } from 'redux-actions'
import * as actions from '../constants'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

let authDetail = ''
// if (typeof window !== 'undefined') {
  // localStorage.setItem('admin', JSON.stringify({ id: 'vu', token: 'vu@gmail.com' }))
  // authDetail = cookies.get('admin') ? JSON.parse(cookies.get('admin')) : ''
  // console.log(cookies.get('admin'))
// }
//dung presist sau

const initialState = {
  test: 'test',
  auth: authDetail,
  error: '',
  count: 1,
  original: {},
  tag: {},
  manga: {},
  user: {},
  team: {},
  author: {},
  comment: {},
  donate: {},
  couple: {},
  dashboard: {},
}

const adminReducer = handleActions(
  {
    [actions.TEST]: (state, action) => {
      return {
        ...state,
        test: 'test done',
      }
    },
    [actions.ADMIN_GET_MANGALIST]: (state, action) => {
      return {
        ...state,
        manga: action.payload,
      }
    },
    [actions.ADMIN_GET_ORIGINAL]: (state, action) => {
      return {
        ...state,
        original: action.payload,
      }
    },
    [actions.ADMIN_GET_COMMENTLIST]: (state, action) => {
      return {
        ...state,
        comment: action.payload,
      }
    },
    [actions.ADMIN_GET_COUPLELIST]: (state, action) => {
      return {
        ...state,
        couple: action.payload,
      }
    },
    [actions.ADMIN_GET_TAGLIST]: (state, action) => {
      return {
        ...state,
        tag: action.payload,
      }
    },
    [actions.ADMIN_GET_USERLIST]: (state, action) => {
      return {
        ...state,
        user: action.payload,
      }
    },
    [actions.ADMIN_GET_TEAMLIST]: (state, action) => {
      return {
        ...state,
        team: action.payload,
      }
    },
    [actions.ADMIN_GET_AUTHORLIST]: (state, action) => {
      return {
        ...state,
        author: action.payload,
      }
    },
    [actions.ADMIN_GET_DONATELIST]: (state, action) => {
      return {
        ...state,
        donate: action.payload,
      }
    },
    [actions.ADMIN_GET_DASHBOARD]: (state, action) => {
      return {
        ...state,
        dashboard: action.payload,
      }
    },

    [actions.ADMIN_LOGOUT]: (state, action) => {
      localStorage.removeItem('admin')
      cookies.remove('admin')
      return {
        ...state,
        auth: '',
      }
    },
    [actions.ADMIN_POST_LOGIN]: (state, action) => {
      const { token } = action.payload
      localStorage.setItem('admin', JSON.stringify(action.payload))
      cookies.set('admin', JSON.stringify(action.payload), {
        path: '/',
        maxAge: 5184000, // 60days
        sameSite: true,
      })
      return {
        ...state,
        auth: action.payload,
      }
    },

    [actions.ADMIN_POST_LOGIN_FAIL]: (state, action) => {
      localStorage.removeItem('admin')
      cookies.remove('admin')
      return {
        ...state,
        auth: '',
        error: action.payload.message,
      }
    },
  },
  initialState
)
export default adminReducer
