import { LOGIN, LOGOUT } from "./authenticationActions";
import {LOCATION_CHANGE} from 'connected-react-router';

const initialState = {
    authenticated: false,
    currentUser: null,
    prevLocation: null,
    currentLocation: null
};

const authenticationReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case LOGIN:
            return {
                ...state,
                authenticated: true,
                currentUser: {
                    email: payload.email,
                    photoURL: payload.photoURL,
                    uid: payload.uid,
                    displayName: payload.displayName,
                    providerId: payload.providerData[0].providerId
                }
            }
        case LOGOUT:
            return {
                ...state,
                authenticated: false,
                currentUser: null
            }
        case LOCATION_CHANGE:
            return {
                ...state,
                prevLocation: state.currentLocation,
                currentLocation: payload.location
            }
        default:
            return state;
    }
}

export default authenticationReducer;