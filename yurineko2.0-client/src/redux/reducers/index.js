import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import generalReducer from './general'
import page from './page'
import user from './user'

const reducer = combineReducers({
  general: generalReducer,
  page,
  user,
})
export default reducer
