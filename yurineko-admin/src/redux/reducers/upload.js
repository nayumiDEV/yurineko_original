import { handleActions } from "redux-actions";
import * as actions from "../constants";
import Cookies from "universal-cookie";

const cookies = new Cookies();

let authDetail = "";
// if (typeof window !== 'undefined') {
// localStorage.setItem('admin', JSON.stringify({ id: 'vu', token: 'vu@gmail.com' }))
// authDetail = cookies.get('admin') ? JSON.parse(cookies.get('admin')) : ''
// console.log(cookies.get('admin'))
// }
//dung presist sau

const initialState = {
  error: "",
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
  novel: {},
  editor: {
    name: "",
    lightnovelId: "",
    publish: "",
    content: {},
    chapterId: "",
  },
};

const uploadReducer = handleActions(
  {
    [actions.UPLOAD_GET_MANGALIST]: (state, action) => {
      return {
        ...state,
        manga: action.payload,
      };
    },
    [actions.UPLOAD_GET_COMMENTLIST]: (state, action) => {
      return {
        ...state,
        comment: action.payload,
      };
    },
    [actions.UPLOAD_GET_REPORT]: (state, action) => {
      return {
        ...state,
        report: action.payload,
      };
    },
    [actions.UPLOAD_INIT_EDITOR]: (state, action) => {
      return {
        ...state,
        editor: {
          ...action.payload,
        },
      };
    },
    [actions.UPLOAD_UPDATE_EDITOR]: (state, action) => {
      return {
        ...state,
        editor: {
          ...state.editor,
          ...action.payload,
        },
      };
    },
    [actions.UPLOAD_GET_NOVELLIST]: (state, action) => {
      return {
        ...state,
        novel: action.payload,
      };
    },
    [actions.CREATE_NOVEL_CHAPTER]: (state, action) => {
      return {
        ...state,
        editor: { ...state.editor, chapterId: action.payload },
      };
    },
  },
  initialState
);
export default uploadReducer;
