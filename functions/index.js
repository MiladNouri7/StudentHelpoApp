const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const database = admin.firestore();
const fbDatabase = admin.database();

exports.addPostLike = functions.https.onCall((data, context) => {
  const { userId, postId, userLike, likes } = data;

  let userFound = false;
  let userLiked = false;

  userLike.forEach(function(like) {
    if (like.userId === userId && like.liked) {
      userFound = true;
      userLiked = like.liked;
    }
  });

  if (userFound) {
    database
      .collection("posts")
      .doc(postId)
      .update({
        likes: likes - 1,
        userLike: admin.firestore.FieldValue.arrayRemove({
          userId: userId,
          liked: userLiked,
        }),
      });
  } else {
    database
      .collection("posts")
      .doc(postId)
      .update({
        likes: likes + 1,
        userLike: admin.firestore.FieldValue.arrayUnion({
          userId: userId,
          liked: true,
        }),
      });
  }
});

exports.addPostCommentLike = functions.https.onCall((data, context) => {
  let liked = false;
  const likesArray = [...data.likes];

  likesArray.forEach((like, index) => {
    if (like === data.userId) {
      if (index > -1) {
        likesArray.splice(index, 1);
      }
      liked = true;
    }
  });

  if (!liked) {
    likesArray.push(data.userId);
  }

  fbDatabase.ref(`PostChat/${data.postId}/${data.id}`).update({
    likes: likesArray,
  });
});

exports.addFollowing = functions.firestore
  .document("following/{userUid}/userFollowing/{profileId}")
  .onCreate(async (snapshot, context) => {
    const following = snapshot.data();
    console.log({ following });
    try {
      const userDoc = await database
        .collection("users")
        .doc(context.params.userUid)
        .get();
      const batch = database.batch();
      batch.set(
        database
          .collection("following")
          .doc(context.params.profileId)
          .collection("userFollowers")
          .doc(context.params.userUid),
        {
          displayName: userDoc.data().displayName,
          photoURL: userDoc.data().photoURL,
          uid: userDoc.id,
        }
      );
      batch.update(database.collection("users").doc(context.params.profileId), {
        followerCount: admin.firestore.FieldValue.increment(1),
      });
      return await batch.commit();
    } catch (error) {
      return console.log(error);
    }
  });

exports.removeFollowing = functions.firestore
  .document("following/{userUid}/userFollowing/{profileId}")
  .onDelete(async (snapshot, context) => {
    const batch = database.batch();
    batch.delete(
      database
        .collection("following")
        .doc(context.params.profileId)
        .collection("userFollowers")
        .doc(context.params.userUid)
    );
    batch.update(database.collection("users").doc(context.params.profileId), {
      followerCount: admin.firestore.FieldValue.increment(-1),
    });
    try {
      return await batch.commit();
    } catch (error) {
      return console.log(error);
    }
  });
