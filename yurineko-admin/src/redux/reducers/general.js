import { handleActions } from 'redux-actions'
import * as actions from '../constants'

const initialState = {isLoading: false}

const generalReducer = handleActions({
    [actions.SET_LOADING]: (state, action)=>{
        return ({
            ...state, 
            isLoading: action.payload
        })
    },
    [actions.OFF_LOADING]: (state, action)=>{
        return ({
            ...state,
            isLoading: false
        })
    }
}, initialState)
export default generalReducer;
