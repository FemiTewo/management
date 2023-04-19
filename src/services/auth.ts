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
export const saveUserInfo = async (
  fplId: string,
  password: string,
  name: string,
) => {
  try {
    await db.collection('users').doc(fplId).set({
      id: fplId,
      name,
      password,
    });
    return true;
  } catch (e) {
    console.log('An error occurred', e);
    return false;
  }
};
