import {
    POOL_LIST_LOAD,
    POOL_SINGLE_LOAD,
    POOL_UNLOAD,
    POOL_CREATE,
    POOL_UPDATE,
    POOL_REMOVE
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    single: {},
    inProgress: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case POOL_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case POOL_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data ? action.payload.data.pool : {}
        };
      case POOL_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case POOL_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case POOL_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      case POOL_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      default:
        return state;
    }
  };
  