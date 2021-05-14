import {
  CLEAR_COMMENTS,
  CREATE_GROUP,
  DELETE_GROUP,
  FETCH_GROUPS,
  LISTEN_TO_GROUP_COMMENT_CHAT,
  UPDATE_GROUP,
} from "./groupActions";

const initialState = {
  groups: [],
  comments: [],
};

const groupReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_GROUP:
      return {
        ...state,
        groups: [...state.groups, payload],
      };
    case UPDATE_GROUP:
      return {
        ...state,
        groups: [
          ...state.groups.filter((evt) => evt.id !== payload.id),
          payload,
        ],
      };
    case DELETE_GROUP:
      return {
        ...state,
        groups: [...state.groups.filter((evt) => evt.id !== payload)],
      };
    case FETCH_GROUPS:
      return {
        ...state,
        groups: payload,
      };
    case LISTEN_TO_GROUP_COMMENT_CHAT:
      return {
        ...state,
        comments: payload,
      };
    case CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
      };
    default:
      return state;
  }
}

export default groupReducer;
