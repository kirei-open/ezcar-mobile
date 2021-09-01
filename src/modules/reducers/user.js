import {
    USER_LIST_LOAD,
    USER_SINGLE_LOAD,
    USER_UNLOAD,
    USER_CREATE,
    USER_UPDATE,
    USER_REMOVE,
    USER_SEARCH
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    single: {},
    inProgress: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case USER_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case USER_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data ? action.payload.data.user : {}
        };
      case USER_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case USER_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case USER_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      case USER_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      case USER_SEARCH:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        }
      default:
        return state;
    }
  };
  