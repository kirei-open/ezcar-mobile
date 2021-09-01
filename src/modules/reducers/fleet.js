import {
    FLEET_LIST_LOAD,
    FLEET_LIST_KEYS,
    FLEET_LIST_FILTER,
    FLEET_SINGLE_LOAD,
    FLEET_UNLOAD,
    FLEET_CREATE,
    FLEET_UPDATE,
    FLEET_REMOVE,
    FLEET_ANALYSIS,
    FLEET_ANALYSIS1,
    FLEET_UTILIZATION,
    FLEET_ANALYSIS_DETAIL,
    FLEET_HISTORY_LOAD
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    keys: [],
    single: {},
    inProgress: false,
    filter: {},
    analysis: {},
    utilization: {},
    startDate: '',
    endDate: ''
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case FLEET_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case FLEET_LIST_KEYS:
        return {
          ...state,
          keys:
            action.payload && action.payload.data ? action.payload.data.keys : []
        };
      case FLEET_LIST_FILTER:
        return {
          ...state,
          filter: action.payload
        };
      case FLEET_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data ? action.payload.data.fleet : {}
        };
      case FLEET_ANALYSIS:
        return {
          ...state,
          analysis: action.payload ? action.payload.data : {}
        };
      case FLEET_ANALYSIS1:
        return {
          ...state,
          analysis: action.payload ? action.payload.data : {}
        };
      case FLEET_UTILIZATION:
        return {
          ...state,
          utilization: action.payload ? action.payload.data : {}
        };
      case FLEET_ANALYSIS_DETAIL:
        return {
          ...state,
          single: action.payload ? action.payload.data : {}
        };
      case FLEET_CREATE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_REMOVE:
        return {
          ...state,
          inProgress: true
        };
      case FLEET_HISTORY_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case FLEET_UNLOAD:
        return initialState;
      default:
        return state;
    }
  };
  