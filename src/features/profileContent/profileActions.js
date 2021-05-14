export const LISTEN_TO_CURRENT_USER_PROFILE = "LISTEN_TO_CURRENT_USER_PROFILE";
export const LISTEN_TO_SELECTED_USER_PROFILE = "LISTEN_TO_SELECTED_USER_PROFILE";
export const LISTEN_TO_USER_PHOTOS =  "LISTEN_TO_USER_PHOTOS";
export const LISTEN_TO_USER_GROUPS = "LISTEN_TO_USER_GROUPS";
export const LISTEN_TO_FOLLOWERS = "LISTEN_TO_FOLLOWERS";
export const LISTEN_TO_FOLLOWINGS = "LISTEN_TO_FOLLOWINGS";
export const SET_FOLLOW_USER = "SET_FOLLOW_USER";
export const SET_UNFOLLOW_USER = "SET_UNFOLLOW_USER";
export const CLEAR_FOLLOWINGS = "CLEAR_FOLLOWINGS";

export const listenToCurrentUserProfile = (profile) => {
    return {
        type: LISTEN_TO_CURRENT_USER_PROFILE,
        payload: profile
    }
}

export const listenToSelectedUserProfile = (profile) => {
    return {
        type: LISTEN_TO_SELECTED_USER_PROFILE,
        payload: profile
    }
}

export const listenToUserPhotos = (photos) => {
    return {
        type: LISTEN_TO_USER_PHOTOS,
        payload: photos
    }
}

export const listenToUserGroups = (groups) => {
    return {
        type: LISTEN_TO_USER_GROUPS,
        payload: groups
    }
}

export const listenToFollowers = (followers) => {
    return {
        type: LISTEN_TO_FOLLOWERS,
        payload: followers
    }
}

export const listenToFollowings = (followings) => {
    return {
        type: LISTEN_TO_FOLLOWINGS,
        payload: followings
    }
}

export const setFollowUser = () => {
    return {
        type: SET_FOLLOW_USER
    }
}

export const setUnfollowUser = () => {
    return {
        type: SET_UNFOLLOW_USER
    }
}