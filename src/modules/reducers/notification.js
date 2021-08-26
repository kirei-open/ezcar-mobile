import {
    NOTIFICATION_LONG_LOAD,
    NOTIFICATION_LONG_UNLOAD,
    NOTIFICATION_SHORT_LOAD,
    NOTIFICATION_SHORT_UNLOAD,
    NOTIFICATION_READ
  } from '../constants/actions';
  
  const initialState = {
    unread: 0,
    shortList: [],
    longList: {}
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case NOTIFICATION_LONG_LOAD:
        return {
          ...state,
          longList:
            action.payload && action.payload.data ? action.payload.data : {}
        };
      case NOTIFICATION_LONG_UNLOAD:
        return {
          ...state,
          longList: {}
        };
      case NOTIFICATION_SHORT_LOAD:
        return {
          ...state,
          shortList:
            action.payload && action.payload.data
              ? action.payload.data.shortList
              : [],
          unread:
            action.payload && action.payload.data ? action.payload.data.unread : 0
        };
      case NOTIFICATION_SHORT_UNLOAD:
        return {
          ...state,
          shortList: [],
          unread: 0
        };
      case NOTIFICATION_READ:
        return {
          ...state,
          unread: 0
        };
      default:
        return state;
    }
  };
  