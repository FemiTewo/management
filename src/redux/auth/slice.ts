import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

export interface InitState {
  isLoggedIn: boolean;
  theme: 'dark' | 'light';
  userData: {
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
    id: string;
  };
}

// Define the initial state using that type
const initialState: InitState = {
  isLoggedIn: false,
  theme: 'light',
  userData: {user_name: '', email: '', first_name: '', last_name: '', id: ''},
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
    switchTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {login, logout} = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUserData = (state: RootState) => state.user.userData;
export const selectTheme = (state: RootState) => state.user.theme;
export default authSlice.reducer;
