import { CHAT_LOAD, CHAT_UNLOAD } from '../constants/actions';

const initialState = {
  list: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHAT_LOAD:
      return {
        ...state,
        list: action.payload ? action.payload.data : {}
      };
    case CHAT_UNLOAD:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
