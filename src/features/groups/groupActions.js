export const CREATE_GROUP = "CREATE_GROUP";
export const UPDATE_GROUP = "UPDATE_GROUP";
export const DELETE_GROUP = "DELETE_GROUP";
export const FETCH_GROUPS = "FETCH_GROUPS";
export const LISTEN_TO_GROUP_COMMENT_CHAT = "LISTEN_TO_GROUP_COMMENT_CHAT";
export const CLEAR_COMMENTS = "CLEAR_COMMENTS";


export const listenToGroups = (groups) => {
    return {
        type: FETCH_GROUPS,
        payload: groups
    }
}

export const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        payload: group
    }
}

export const updateEvent = (group) => {
    return {
        type: UPDATE_GROUP,
        payload: group
    }
}

export const deleteEvent = (groupId) => {
    return {
        type: DELETE_GROUP,
        payload: groupId
    }
}

//Comments chat
export const listenToGroupCommentsChat = (comments) => {
    return {
        type: LISTEN_TO_GROUP_COMMENT_CHAT,
        payload: comments
    }
}