import {
    APP_LOAD,
    APP_REDIRECT,
    APP_LOGIN,
    APP_LOGIN_SSO,
    APP_LOGOUT,
    APP_LOGIN_UNLOAD,
    APP_SET_LOCATION,
    APP_SET_TITLE,
    APP_CHANGE_PASSWORD,
    APP_RESET_PASSWORD,
    ORDER_SINGLE_LOAD,
    ORDER_CREATE,
    ORDER_UPDATE,
    ORDER_COMMAND,
    ORDER_UNLOAD,
    DIVISION_LIST_LOAD,
    DIVISION_REMOVE,
    DIVISION_CREATE,
    DIVISION_UPDATE,
    DIVISION_UNLOAD,
    POOL_LIST_LOAD,
    POOL_REMOVE,
    POOL_UPDATE,
    POOL_CREATE,
    POOL_UNLOAD,
    COMPANY_LIST_LOAD,
    COMPANY_CREATE,
    COMPANY_REMOVE,
    COMPANY_UPDATE,
    COMPANY_UNLOAD,
    FLEET_LIST_LOAD,
    FLEET_LIST_KEYS,
    FLEET_LIST_FILTER,
    FLEET_REMOVE,
    FLEET_UPDATE,
    FLEET_CREATE,
    FLEET_UNLOAD,
    USER_CREATE,
    USER_UPDATE,
    USER_REMOVE,
    USER_LIST_LOAD,
    USER_UNLOAD,
    FLEET_REPORT_REMOVE,
    FLEET_REPORT_CREATE,
    FLEET_REPORT_UPDATE,
    FLEET_REPORT_LIST_LOAD,
    FLEET_REPORT_UNLOAD
  } from '../constants/actions';
  
  const initialState = {
    token: null,
    redirectTo: null,
    status: '',
    message: '',
    location: {
      lat: -6.1751,
      long: 106.865
    },
    title: '',
    reload: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case APP_LOAD:
        return {
          ...state,
          token: action.token || null,
          status: action.status,
          message:
            action.payload && action.payload.data
              ? action.payload.data.message
              : null,
          reload: false
        };
      case APP_REDIRECT:
        return {
          ...state,
          redirectTo: null
        };
      case APP_LOGIN:
        return {
          ...state,
          token:
            action.payload && action.payload.data
              ? action.payload.data.token
              : null,
          status: action.payload ? action.payload.status : '',
          message:
            action.payload && action.payload.data
              ? action.payload.data.message
              : null
        };
      case APP_LOGIN_SSO:
        return {
          ...state,
          token:
            action.payload && action.payload.data
              ? action.payload.data.token
              : null,
          status: action.payload ? action.payload.status : '',
          message:
            action.payload && action.payload.data
              ? action.payload.data.message
              : null
        };
      case APP_LOGIN_UNLOAD:
        return {
          ...state,
          status: '',
          message: ''
        };
      case APP_LOGOUT:
        return {
          ...state,
          token: null,
          reload: true
        };
      case APP_SET_LOCATION:
        return {
          ...state,
          location: {
            lat: action.payload.lat,
            long: action.payload.long
          }
        };
      case APP_SET_TITLE:
        return {
          ...state,
          title: action.payload
        };
      case APP_RESET_PASSWORD:
      case APP_CHANGE_PASSWORD:
        return {
          ...state,
          status: action.status,
          message:
            action.payload && action.payload.data && action.payload.data.message
        };
      case ORDER_CREATE:
      case ORDER_UPDATE:
        return {
          ...state,
          status:
            action.payload && action.payload.status
              ? action.payload.status
              : null,
          message:
            action.payload && action.payload.data && action.payload.data.message
              ? action.payload.data.message
              : null
        };
      case DIVISION_LIST_LOAD:
      case FLEET_LIST_LOAD:
      case FLEET_LIST_KEYS:
      case FLEET_LIST_FILTER:
      case COMPANY_LIST_LOAD:
      case POOL_LIST_LOAD:
      case FLEET_REPORT_LIST_LOAD:
      case USER_LIST_LOAD:
        return {
          ...state,
          reload: false
        };
      case USER_UNLOAD:
        return {
          ...state,
          reload: false,
          status: '',
          message: ''
        };
      case COMPANY_UNLOAD:
      case DIVISION_UNLOAD:
      case POOL_UNLOAD:
      case FLEET_REPORT_UNLOAD:
      case ORDER_UNLOAD:
      case FLEET_UNLOAD:
        return {
          ...state,
          status: '',
          message: ''
        };
      case ORDER_SINGLE_LOAD:
        return {
          ...state,
          reload: false,
          status: action.status,
          message:
            action.payload && action.payload.data && action.payload.data.message
        };
      case DIVISION_REMOVE:
      case DIVISION_CREATE:
      case DIVISION_UPDATE:
      case POOL_REMOVE:
      case POOL_UPDATE:
      case POOL_CREATE:
      case COMPANY_CREATE:
      case COMPANY_REMOVE:
      case COMPANY_UPDATE:
      case FLEET_REMOVE:
      case FLEET_UPDATE:
      case FLEET_CREATE:
      case FLEET_REPORT_CREATE:
      case FLEET_REPORT_UPDATE:
      case FLEET_REPORT_REMOVE:
      case USER_UPDATE:
      case USER_CREATE:
      case USER_REMOVE:
      case ORDER_COMMAND:
        return {
          ...state,
          status:
            action.payload && action.payload.status
              ? action.payload.status
              : null,
          message:
            action.payload && action.payload.data && action.payload.data.message
              ? action.payload.data.message
              : null,
          reload: true
        };
      default:
        return state;
    }
  };
  