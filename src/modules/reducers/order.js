import {
    ORDER_LIST_LOAD,
    ORDER_UNLOAD,
    ORDER_SUMMARY,
    ORDER_CREATE,
    ORDER_UPDATE,
    ORDER_COMMAND,
    ORDER_SINGLE_UNLOAD,
    ORDER_SINGLE_LOAD,
    ORDER_UTILIZATION_LOAD,
    ORDER_UTILIZATION_UNLOAD,
    FLEET_HISTORY_LOAD
  } from '../constants/actions';
  
  const initialState = {
    list: {},
    utilization: {},
    histories: [],
    single: {},
    summaries: {},
    inProgress: false,
    loaded: false
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case ORDER_LIST_LOAD:
        return {
          ...state,
          list: action.payload ? action.payload.data : {}
        };
      case ORDER_UTILIZATION_LOAD:
        return {
          ...state,
          utilization: action.payload ? action.payload.data : {}
        };
      case ORDER_SINGLE_LOAD:
        return {
          ...state,
          single:
            action.payload && action.payload.data ? action.payload.data.order : {}
        };
      case ORDER_SUMMARY:
        return {
          ...state,
          summaries: action.payload ? action.payload.data : {}
        };
      case ORDER_CREATE:
      case ORDER_COMMAND:
      case ORDER_UPDATE:
        return {
          ...state,
          inProgress: true
        };
      case ORDER_SINGLE_UNLOAD:
        return {
          ...state,
          single: initialState.single
        };
      case ORDER_UNLOAD:
        return {
          ...state,
          ...initialState
        };
      case FLEET_HISTORY_LOAD:
        return {
          ...state,
          histories: action.payload ? action.payload.data : {}
        };
      default:
        return state;
    }
  };
  