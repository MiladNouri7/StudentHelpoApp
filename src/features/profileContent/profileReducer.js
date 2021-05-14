import { CLEAR_FOLLOWINGS, LISTEN_TO_CURRENT_USER_PROFILE, LISTEN_TO_FOLLOWERS, LISTEN_TO_FOLLOWINGS, LISTEN_TO_SELECTED_USER_PROFILE, LISTEN_TO_USER_GROUPS, LISTEN_TO_USER_PHOTOS, SET_FOLLOW_USER, SET_UNFOLLOW_USER} from "./profileActions";

const initialState = {
    currentActiveUserProfile: null,
    selectedUserProfile: null,
    photos: [],
    profileGroups: [],
    followers: [],
    followings: [],
    followingUser: false, //This determine whether the current user is following another user
};

const profileReducer = (state = initialState, {type, payload}) => {
    switch(type){
        case LISTEN_TO_CURRENT_USER_PROFILE:
            return {
                ...state,
                currentActiveUserProfile: payload
            };
        case LISTEN_TO_SELECTED_USER_PROFILE:
            return {
                ...state,
                selectedUserProfile: payload
            };
        case LISTEN_TO_USER_PHOTOS:
            return {
                ...state,
                photos: payload
            }
        case LISTEN_TO_USER_GROUPS:
            return {
                ...state,
                profileGroups: payload
            }
        case LISTEN_TO_FOLLOWERS:
            return {
                ...state,
                followers: payload
            }
        case LISTEN_TO_FOLLOWINGS:
            return{
                ...state,
                followings: payload
            }
        case SET_FOLLOW_USER:
            return {
                ...state,
                followingUser: true
            }
        case SET_UNFOLLOW_USER:
            return {
                ...state,
                followingUser: false
            }
        case CLEAR_FOLLOWINGS:
            return {
                ...state,
                followers: [],
                followings: []
            }
        default:
            return state;
    }
}

export default profileReducer;