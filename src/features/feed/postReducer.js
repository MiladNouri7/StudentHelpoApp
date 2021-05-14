import { CLEAR_COMMENTS, LISTEN_TO_POST_CHAT } from "./postActions";



const initialState = {
    comments: []
}

const postReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case LISTEN_TO_POST_CHAT:
            return {
                ...state,
                comments: payload
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

export default postReducer;