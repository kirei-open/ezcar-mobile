import {
    TESTING_LOAD,
    TESTING_UNLOAD,
    FLEET_CREATE,
    FLEET_REMOVE
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    single: {},
    summaries: {},
    inProgress: false,
    loaded: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case TESTING_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case TESTING_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      case FLEET_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      default:
        return state;
    }
  };
  