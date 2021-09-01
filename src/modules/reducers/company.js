import {
    COMPANY_LIST_LOAD,
    COMPANY_SINGLE_LOAD,
    COMPANY_UNLOAD,
    COMPANY_CREATE,
    COMPANY_UPDATE,
    COMPANY_REMOVE
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    single: {},
    inProgress: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case COMPANY_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case COMPANY_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data
              ? action.payload.data.company
              : {}
        };
      case COMPANY_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case COMPANY_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case COMPANY_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      case COMPANY_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      default:
        return state;
    }
  };
  