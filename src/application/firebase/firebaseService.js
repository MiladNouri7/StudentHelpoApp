import { toast } from 'react-toastify';
import { setupProfileData } from './firestoreService';
import firebase from '../configuration/firebase';

export const convertFbObjectIntoArray = (snapshot) => {
    if(snapshot) {
        return Object.entries(snapshot).map(e => Object.assign({}, e[1], {id: e[0]}));
    }
}

export const emailLogin = (credentials) => {
    return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
}

export const LogoutFromFb = () => {
    return firebase.auth().signOut();
}

export const signupIntoFb = async (credentials) => {
    try {
        const reponseResult = await firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password);
        await reponseResult.user.updateProfile({
            displayName: credentials.displayName,
        });
        return await setupProfileData(reponseResult.user);
    } catch (error) {
        throw error;
    }
}

export const loginWithExternalSites = async (chosenSite) => {
    let site;

    if(chosenSite === "google"){
        site = new firebase.auth.GoogleAuthProvider();
    }

    if(chosenSite === "facebook"){
        site = new firebase.auth.FacebookAuthProvider();
    }

    try {
        const reponseResult = await firebase.auth().signInWithPopup(site);
        if(reponseResult.additionalUserInfo.isNewUser){
            await setupProfileData(reponseResult.user);
        }
    } catch(error) {
        toast.error(error.message);
    }
}

export const updatePasswordInFb = (credentials) => {
    const currentlyActiveUser = firebase.auth().currentUser;
    return currentlyActiveUser.updatePassword(credentials.newPassword1);
}

export const uploadImageToFbStorage = (imageFile, imageFileName) => {
    const currentlyActiveUser = firebase.auth().currentUser;
    const reference = firebase.storage().ref();
    return reference.child(`${currentlyActiveUser.uid}/user_images/${imageFileName}`).put(imageFile);
}

export const deleteImageFromFbStorage = (imageFileName) => {
    const currentUserUid = firebase.auth().currentUser.uid;
    const reference = firebase.storage().ref();
    const photoReference = reference.child(`${currentUserUid}/user_images/${imageFileName}`);
    return photoReference.delete();
}

export const addGroupChatCommentsToFb = (groupId, commentValues) => {
    const currentlyActiveUser = firebase.auth().currentUser;
    const newGroupComment = {
        displayName: currentlyActiveUser.displayName,
        photoURL: currentlyActiveUser.photoURL,
        uid: currentlyActiveUser.uid,
        text: commentValues.comment,
        date: Date.now(),
        parentId: commentValues.parentId
    }

    return firebase.database().ref(`chat/${groupId}`).push(newGroupComment);
}

export const getGroupChatReference = (groupId) => {
    return firebase.database().ref(`chat/${groupId}`).orderByKey();
}

export const addPostChatComment = (postId, values) => {
    const userActiveUser = firebase.auth().currentUser;
    const newComment = {
        displayName: userActiveUser.displayName,
        postId: postId,
        photoURL: userActiveUser.photoURL,
        uid: userActiveUser.uid,
        likes: [""],
        text: values.comment,
        date: Date.now(),
        parentId: values.parentId
    }

    return firebase.database().ref(`PostChat/${postId}`).push(newComment);
}

export const getPostChatRef = (postId) => {
    return firebase.database().ref(`PostChat/${postId}`).orderByKey()
}

export const likePostComment = (comment) => {

    const currentActiveUser = firebase.auth().currentUser;
    const addPostCommentLike = firebase.functions().httpsCallable("addPostCommentLike");
    addPostCommentLike({
        ...comment,
        userId: currentActiveUser.uid,
    });
}