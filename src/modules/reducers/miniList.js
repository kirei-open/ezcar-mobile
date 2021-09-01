import {
    FLEET_REPORT_LIST_LOAD,
    FLEET_REPORT_SINGLE_LOAD,
    FLEET_REPORT_UNLOAD,
    FLEET_REPORT_CREATE,
    FLEET_REPORT_UPDATE,
    FLEET_REPORT_REMOVE,
    FLEET_REPORT_SINGLE_UNLOAD
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    single: {},
    inProgress: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case FLEET_REPORT_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case FLEET_REPORT_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data
              ? action.payload.data.fleetreport
              : {}
        };
      case FLEET_REPORT_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_REPORT_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_REPORT_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_REPORT_SINGLE_UNLOAD:
        return {
          ...state,
          single: initialState.single
        };
      case FLEET_REPORT_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      default:
        return state;
    }
  };
  