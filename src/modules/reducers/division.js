import {
    DIVISION_LIST_LOAD,
    DIVISION_SINGLE_LOAD,
    DIVISION_UNLOAD,
    DIVISION_CREATE,
    DIVISION_UPDATE,
    DIVISION_REMOVE
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    single: {},
    inProgress: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case DIVISION_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case DIVISION_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data
              ? action.payload.data.division
              : {}
        };
      case DIVISION_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case DIVISION_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case DIVISION_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      case DIVISION_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      default:
        return state;
    }
  };  