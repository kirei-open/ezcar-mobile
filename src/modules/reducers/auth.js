import {
    APP_LOAD,
    APP_LOGIN,
    APP_LOGIN_SSO,
    APP_USER,
    APP_LOGIN_UNLOAD,
    APP_LOGOUT
  } from '../constants/actions';
  
  const initialState = {
    inProgress: false,
    user: null,
    loaded: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case APP_LOGIN:
        return {
          ...state,
          user:
            action.payload && action.payload.data
              ? action.payload.data.user
              : null,
          inProgress: false
        };
      case APP_LOGIN_SSO:
        return {
          ...state,
          user:
            action.payload && action.payload.data
              ? action.payload.data.user
              : null,
          inProgress: false
        };
      case APP_LOAD:
        return {
          ...state,
          inProgress: false,
          user:
            action.payload && action.payload.data
              ? action.payload.data.user
              : null,
          loaded: true
        };
      case APP_USER:
        return {
          ...state,
          user:
            action.payload && action.payload.data
              ? action.payload.data.user
              : null,
          inProgress: false
        };
      case APP_LOGIN_UNLOAD:
        return {
          ...state,
          inProgress: false
        };
      case APP_LOGOUT:
        return {
          ...state,
          user: null,
          inProgress: false,
          loaded: true
        };
      default:
        return state;
    }
  };
  