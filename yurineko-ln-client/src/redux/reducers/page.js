import { handleActions } from 'redux-actions'
import * as actions from '../constants'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const initialState = { rank: '', auth: '', newMangaList: '', user: '', newR18List: '', r18Rank: '' }

const pageReducer = handleActions(
  {
    [actions.GET_RANK]: (state, action) => {
      return {
        ...state,
        rank: action.payload,
      }
    },
    [actions.GET_NEW_MANGA]: (state, action) => {
      const { page, resultCount } = action.payload
      return {
        ...state,
        newMangaList: {
          ...state.newMangaList,
          resultCount,
          [page]: { ...action.payload },
        },
      }
    },
    [actions.GET_R18_RANK]: (state, action) => {
      return {
        ...state,
        r18Rank: action.payload,
      }
    },
    [actions.GET_NEW_R18_MANGA]: (state, action) => {
      const { page, resultCount } = action.payload
      return {
        ...state,
        newR18List: {
          ...state.newR18List,
          resultCount,  
          [page]: { ...action.payload },
        },
      }
    },
  },
  initialState
)
export default pageReducer
