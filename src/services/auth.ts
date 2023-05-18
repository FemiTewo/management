import {db} from './firebaseConfig';

export const checkIfUserExists = async (fplId: string) => {
  try {
    const response = await db.collection('users').doc(fplId).get();
    if (response) {
      console.log('User exists: ', response.exists);

      if (response.exists) {
        console.log('User data: ', response.data());
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log('An error occurred', e);
    return false;
  }
};
export const completeAuth = async (email: string, password: string) => {
  try {
    const response = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .where('password', '==', password)
      .get();
    if (response) {
      if (!response.empty) {
        let doc = response.docs[0].data();
        delete doc.projects;
        doc['id'] = response.docs[0].id;
        return doc;
      }
    }
    throw new Error('invalid credentials');
  } catch (e) {
    throw e;
  }
};

export const getUserData = async (fplId: string) => {
  try {
    const response = await db.collection('users').doc(fplId).get();
    if (response) {
      console.log('User exists: ', response.exists);

      if (response.exists) {
        const data = response.data();
        return data;
      }
    }
  } catch (e) {
    console.log('An error occurred', e);
  }
};

export const saveUserInfo = async (inputs: {[x: string]: string}) => {
  try {
    const newUserDoc = await db.collection('users').add({
      ...inputs,
      projects: [],
    });
    return {newUserDoc, id: newUserDoc?.id};
  } catch (e) {
    console.log('An error occurred', e);
    return false;
  }
};
