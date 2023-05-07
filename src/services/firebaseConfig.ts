import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const RNfirebaseConfig = {
  apiKey: 'AIzaSyB4L4QxYvoWnh4Kvwcsa3y9WXf47Z5wr7I',
  authDomain: 'management-a0bbd.firebaseapp.com',
  projectId: 'management-a0bbd',
  storageBucket: 'management-a0bbd.appspot.com',
  messagingSenderId: '108685643956',
  appId: '1:108685643956:web:547e209e304cb2b78a47e1',
  measurementId: 'G-G8BVVDY25Y',
  databaseURL: 'https://management-a0bbd.com',
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(RNfirebaseConfig);
} else {
  app = firebase.app();
}
export default app;
export const db = firebase.firestore();
export const fieldValue = firebase.firestore.FieldValue;
