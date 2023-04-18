import {db} from './firebaseConfig';

export const createWallet = async (fplId: string) => {
  try {
    await db.collection('wallets').doc(fplId).set({
      balance: '0',
    });
    return true;
  } catch (e) {
    console.log('An error occurred', e);
    return false;
  }
};
