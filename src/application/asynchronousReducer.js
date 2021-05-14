const ASYNC_ACTION_ERROR = "ASYNC_ACTION_ERROR";
const START_ASYNC_ACTION = "START_ASYNC_ACTION";
const FINISH_ASYNC_ACTION = "FINISH_ASYNC_ACTION";
export const APPLICATION_LOADED = "APPLICATION_LOADED";

export const startAsynchronousAction = () => {
    return {
        type: START_ASYNC_ACTION
    }
}

export const finishAsynchronousAction = () => {
    return {
        type: FINISH_ASYNC_ACTION
    }
}

export const asynchronousActionError = (error) => {
    return {
        type: ASYNC_ACTION_ERROR,
        payload: error
    }
}

const initialState = {
    loading: false,
    error: null,
    initialized: false
}

const asynchronousReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case START_ASYNC_ACTION:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FINISH_ASYNC_ACTION:
            return {
                ...state,
                loading: false
            };
        case ASYNC_ACTION_ERROR:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case APPLICATION_LOADED:
            return {
               ...state,
               initialized: true,
            };
        default:
            return state;

    }
}

export default asynchronousReducer;

