import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface InitState {
  isLoggedIn: boolean;
  userData: {
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Define the initial state using that type
const initialState: InitState = {
  isLoggedIn: false,
  userData: {user_name: '', email: '', first_name: '', last_name: ''},
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, {payload}: PayloadAction) => {
      state.isLoggedIn = true;
      state.userData = {
        ...payload,
      };
    },
    logout: state => {
      state.isLoggedIn = false;
      state.userData = initialState.userData;
    },
  },
});

export const {login} = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUserData = (state: RootState) => state.user.userData;
export default authSlice.reducer;
