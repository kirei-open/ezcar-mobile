import { SEARCH_LOAD, SEARCH_UNLOAD } from '../constants/actions';

const initialState = {
  result: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_LOAD:
      return {
        ...state,
        result: {
          ...state.result,
          [action.searchField]: action.payload ? action.payload.data : {}
        }
      };
    case SEARCH_UNLOAD:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
