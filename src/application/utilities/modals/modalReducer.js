const OPEN_THE_MODAL = 'OPEN_THE_MODAL';
const CLOSE_THE_MODAL = 'CLOSE_THE_MODAL';


export const openTheModal = (payload) => {
    return {
        type: OPEN_THE_MODAL,
        payload
    }
}

export const closeTheModal = () => {
    return {
        type: CLOSE_THE_MODAL
    }
}

const initialState = null;

const modalReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case OPEN_THE_MODAL:
            const {modalType, modalProps} = payload;
            return {modalType, modalProps};
        case CLOSE_THE_MODAL:
            return null;
        default:
            return state;
    }
}

export default modalReducer;