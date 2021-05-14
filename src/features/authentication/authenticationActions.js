import firebase from '../../application/configuration/firebase';
import { dataSnapshotFromFs, getUserProfile } from "../../application/firebase/firestoreService";
import { listenToCurrentUserProfile } from "../profileContent/profileActions";
import { APPLICATION_LOADED } from "../../application/asynchronousReducer";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const signInUser = (user) => {
    return {
        type: LOGIN,
        payload: user
    }
}

export const verifyAuth = () => {
    return (dispatch) => {
        return firebase.auth().onAuthStateChanged(user => {
            if(user){
                dispatch({type: LOGIN, payload: user});
                const profReference = getUserProfile(user.uid);
                profReference.onSnapshot(snapshot => {
                    dispatch(listenToCurrentUserProfile(dataSnapshotFromFs(snapshot)));
                    dispatch({type: APPLICATION_LOADED});
                })
            }else{
                dispatch(signOutUser());
                dispatch({type: APPLICATION_LOADED});
            }
        })
    }
}

export const signOutUser = () => {
    return {
        type: LOGOUT
    }
}