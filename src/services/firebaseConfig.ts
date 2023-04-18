import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const RNfirebaseConfig = {
  apiKey: 'AIzaSyCi6z8ynD1BBXnq73hFRfv7njaao-AfRyU',
  authDomain: 'fantasea-8f81a.firebaseapp.com',
  projectId: 'fantasea-8f81a',
  storageBucket: 'fantasea-8f81a.appspot.com',
  messagingSenderId: '329390059305',
  appId: '1:329390059305:web:cf4c57e2701ebd3dadd138',
  measurementId: 'G-N87RTCHGYE',
  databaseURL: 'https://fantasea-8f81a.firebaseio.com',
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(RNfirebaseConfig);
} else {
  app = firebase.app();
}
export default app;
export const db = firebase.firestore();
