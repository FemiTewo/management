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
export const completeAuth = async (fplId: string, password: string) => {
  try {
    const response = await db.collection('users').doc(fplId).get();
    if (response) {
      console.log('User exists: ', response.exists);

      if (response.exists) {
        const data = response.data();
        if (data?.password === password) {
          return true;
        }
        return false;
      }
    }
    return false;
  } catch (e) {
    console.log('An error occurred', e);
    return false;
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
