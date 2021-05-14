import firebase from "../configuration/firebase";
import 'firebase/firestore'
import 'firebase/functions'

const database = firebase.firestore();

export const dataSnapshotFromFs = (snapshot) => {
  if (!snapshot.exists) {
    return undefined;
  }
  const dataFromFs = snapshot.data();

  for (const prop in dataFromFs) {
    if (dataFromFs.hasOwnProperty(prop)) {
      if (dataFromFs[prop] instanceof firebase.firestore.Timestamp) {
        dataFromFs[prop] = dataFromFs[prop].toDate();
      }
    }
  }

  return {
    ...dataFromFs,
    id: snapshot.id,
  };
}

export const listenToGroupsDataFromFs = (predicate) => {
  const currentActiveUser = firebase.auth().currentUser;
  const reference = database.collection("groups").orderBy("date");
  switch (predicate.get("filter")) {
    case "isJoining":
      return reference
        .where("attendeeIds", "array-contains", currentActiveUser.uid)
        .where("date", ">=", predicate.get("startDate"));
    case "isGroupHost":
      return reference
        .where("hostId", "==", currentActiveUser.uid)
        .where("date", ">=", predicate.get("startDate"));
    default:
      return reference.where("date", ">=", predicate.get("startDate"));
  }
}

export const listenToGroupDataFromFs = (groupId) => {
  return database.collection("groups").doc(groupId);
}

export const addGroupToFs = (group) => {
  const currentActiveUser = firebase.auth().currentUser;
  return database.collection("groups").add({
    ...group,
    hostId: currentActiveUser.uid,
    hostName: currentActiveUser.displayName,
    hostPhotoURL: currentActiveUser.photoURL || null,
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: currentActiveUser.uid,
      displayName: currentActiveUser.displayName,
      photoURL: currentActiveUser.photoURL || null,
    }),
    attendeeIds: firebase.firestore.FieldValue.arrayUnion(currentActiveUser.uid),
  });
}

export const addPostToFs = (input) => {
  const currentActiveUser = firebase.auth().currentUser;
  return database.collection("posts").add({
    hostName: currentActiveUser.displayName,
    hostId: currentActiveUser.uid,
    createdTime: String(new Date()),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    message: input,
    likes: 0,
    userLike: firebase.firestore.FieldValue.arrayUnion({
      userId: "",
      liked: false,
    }),
    photoURL: currentActiveUser.photoURL,
  });
}

export const addNotesToFs = (notes) => {

  const currentActiveUser = firebase.auth().currentUser;
  return database.collection("notes").add({
    ownerId: currentActiveUser.uid,
    title: notes.title,
    body: notes.body,
    lastModified: notes.lastModified
  });

}

export const deleteNotesFromFs = (noteId) => {
  return database.collection("notes").doc(noteId).delete();
}

export const saveNotesIntoFs = (note) => {
  return database.collection("notes").doc(note.id).update(note);
}

export const updateLikesInFs = (id, userLike, likes) => {


  const currentActiveUser = firebase.auth().currentUser;

  const addPostLike = firebase.functions().httpsCallable("addPostLike");
  addPostLike({
    userId: currentActiveUser.uid,
    postId: id,
    userLike: userLike,
    likes: likes,
  });

}

export const updateGroupDataInFs = (group) => {
  return database.collection("groups").doc(group.id).update(group);
}

export const deleteGroupFromFs = (groupId) => {
  return database.collection("groups").doc(groupId).delete();
}

export const deletePostInFs = (postId) => {
  return database.collection("posts").doc(postId).delete();
}

export const cancelGroupMeetingToggle = (group) => {
  return database.collection("groups").doc(group.id).update({
    isCancelled: !group.isCancelled,
  });
}

export const setupProfileData = (user) => {
  return database
    .collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export const getUserProfile = (userId) => {
  return database.collection("users").doc(userId);
}

export const updateUserProfile = async (profile) => {
  const currentActiveUser = firebase.auth().currentUser;
  try {
    if (currentActiveUser.displayName !== profile.displayName) {
      await currentActiveUser.updateProfile({
        displayName: profile.displayName,
      });
    }
    return await database.collection("users").doc(currentActiveUser.uid).update(profile);
  } catch (error) {
    throw error;
  }
}

export const updateUserProfileImage = async (photoURL, imageFileName) => {
  const currentActiveUser = firebase.auth().currentUser;
  const documentReference = database.collection("users").doc(currentActiveUser.uid);

  try {
    const userDocument = await documentReference.get();
    if (!userDocument.data().photoURL) {
      await database.collection("users").doc(currentActiveUser.uid).update({
        photoURL: photoURL,
      });
      await currentActiveUser.updateProfile({
        photoURL: photoURL,
      });
    }
    return await database.collection("users").doc(currentActiveUser.uid).collection("photos").add({
      name: imageFileName,
      url: photoURL,
    });
  } catch (error) {
    throw error;
  }
}

export const getUserImages = (userId) => {
  return database.collection("users").doc(userId).collection("photos");
}

export const setMainProfilePhoto = async (photo) => {
  const currentActiveUser = firebase.auth().currentUser;
  const currentDate = new Date();
  const groupDocumentQuery = database
    .collection('groups')
    .where('attendeeIds', 'array-contains', currentActiveUser.uid)
    .where('date', '>=', currentDate);
  const userFollowingRef = database
    .collection('following')
    .doc(currentActiveUser.uid)
    .collection('userFollowing');

  const batchRef = database.batch();
  batchRef.update(database.collection('users').doc(currentActiveUser.uid), {
    photoURL: photo.url,
  });
  try {
    const groupQuerySnapshot = await groupDocumentQuery.get();
    for (let i = 0; i < groupQuerySnapshot.docs.length; i++) {
      let groupDocument = groupQuerySnapshot.docs[i];
      if (groupDocument.data().hostId === currentActiveUser.uid) {
        batchRef.update(groupQuerySnapshot.docs[i].ref, {
          hostPhotoURL: photo.url,
        });
      }
      batchRef.update(groupQuerySnapshot.docs[i].ref, {
        attendees: groupDocument.data().attendees.filter((attendee) => {
          if (attendee.id === currentActiveUser.uid) {
            attendee.photoURL = photo.url;
          }
          return attendee;
        }),
      });
    }
    const userFollowingSnap = await userFollowingRef.get();
    userFollowingSnap.docs.forEach((docRef) => {
      let followingDocRef = database
        .collection('following')
        .doc(docRef.id)
        .collection('userFollowers')
        .doc(currentActiveUser.uid);
        batchRef.update(followingDocRef, {
        photoURL: photo.url
      })
    });

    await batchRef.commit();

    return await currentActiveUser.updateProfile({
      photoURL: photo.url,
    });
  } catch (error) {
    throw error;
  }
}

export const deleteImageFromUserCollection = (photoId) => {
  const cuurentActiveUser = firebase.auth().currentUser;
  return database
    .collection("users")
    .doc(cuurentActiveUser.uid)
    .collection("photos")
    .doc(photoId)
    .delete();
}

export const addGroupAttendee = (group) => {
  const currentActiveUser = firebase.auth().currentUser;
  return database
    .collection("groups")
    .doc(group.id)
    .update({
      attendees: firebase.firestore.FieldValue.arrayUnion({
        id: currentActiveUser.uid,
        displayName: currentActiveUser.displayName,
        photoURL: currentActiveUser.photoURL || null,
      }),
      attendeeIds: firebase.firestore.FieldValue.arrayUnion(currentActiveUser.uid),
    });
}

export const leaveGroup = async (group) => {
  const currentActiveUser = firebase.auth().currentUser;

  try {
    const groupDocument = await database.collection("groups").doc(group.id).get();
    return database
      .collection("groups")
      .doc(group.id)
      .update({
        attendeeIds: firebase.firestore.FieldValue.arrayRemove(currentActiveUser.uid),
        attendees: groupDocument
          .data()
          .attendees.filter((attendee) => attendee.id !== currentActiveUser.uid),
      });
  } catch (error) {
    throw error;
  }
}

export const getUserGroupQuerySelection = (activatedTab, userUid) => {
  let groupsReference = database.collection("groups");
  const currentDate = new Date();
  switch (activatedTab) {
    case 1: //past groups
      return groupsReference
        .where("attendeeIds", "array-contains", userUid)
        .where("date", "<=", currentDate)
        .orderBy("date", "desc");
    case 2: //hosting
      return groupsReference.where("hostId", "==", userUid).orderBy("date");
    default:
      return groupsReference
        .where("attendeeIds", "array-contains", userUid)
        .where("date", ">=", currentDate)
        .orderBy("date");
  }
}

export const followUser = async (profile) => {
  const currentActiveUser = firebase.auth().currentUser;
  const batch = database.batch();
  try {
    batch.set(database.collection("following")
      .doc(currentActiveUser.uid)
      .collection("userFollowing")
      .doc(profile.id),{
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        uid: profile.id,
      });
    batch.update(database
      .collection("users")
      .doc(currentActiveUser.uid), {
        followingCount: firebase.firestore.FieldValue.increment(1),
      });
      return await batch.commit();
  } catch (error) {
    throw error;
  }
}

export const unfollowUser = async (profile) => {
  const currentActiveUser = firebase.auth().currentUser;
  const batchReference = database.batch();
  try {
    batchReference.delete(
      database
        .collection('following')
        .doc(currentActiveUser.uid)
        .collection('userFollowing')
        .doc(profile.id)
    );

    batchReference.update(database.collection('users').doc(currentActiveUser.uid), {
      followingCount: firebase.firestore.FieldValue.increment(-1),
    });

    return await batchReference.commit();
  } catch (error) {
    throw error;
  }
}

export const getUserFollowers = (userProfileId) => {
  return database.collection("following").doc(userProfileId).collection("userFollowers");
}

export const getUserFollowings = (userProfileId) => {
  return database.collection("following").doc(userProfileId).collection("userFollowing");
}

export const getUserFollowingDocument = (userProfileId) => {
  const currentActiveUser = firebase.auth().currentUser;
  return database
    .collection("following")
    .doc(currentActiveUser.uid)
    .collection("userFollowing")
    .doc(userProfileId)
    .get();
}


