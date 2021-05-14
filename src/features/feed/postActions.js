export const LISTEN_TO_POST_CHAT = "LISTEN_TO_POST_CHAT";
export const CLEAR_COMMENTS = "CLEAR_COMMENTS";

export const listenToPostChat = (comments) => {
    return {
        type: LISTEN_TO_POST_CHAT,
        payload: comments
    }
}