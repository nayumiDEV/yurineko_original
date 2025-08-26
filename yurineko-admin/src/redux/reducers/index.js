import { handleActions } from 'redux-actions'
import {combineReducers} from 'redux'
import generalReducer from './general';
import adminReducer from './admin';
import uploadReducer from './upload';

const reducer = combineReducers({
    general: generalReducer,
    admin: adminReducer,
    upload: uploadReducer
})
export default reducer;
