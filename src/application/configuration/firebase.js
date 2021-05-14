import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';


const fbConfiguration = {
	//Firebase configuration goes here
  };

firebase.initializeApp(fbConfiguration);
firebase.firestore();

export default firebase;