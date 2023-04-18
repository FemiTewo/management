import instance from './axiosInstance';
import paths from './paths';

export const getUserDetails = async (id: string) => {
  try {
    const response = await instance.get(paths.userDetails(id));
    if (response) {
      console.log(response?.data);
      return response?.data;
    }
  } catch (e) {
    console.log(e);
  }
};

export const checkUserIsAManager = async (id: string) => {
  try {
    let response = await getUserDetails(paths.userDetails(id));
    if (response) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
  }
};
