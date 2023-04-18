import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface InitState {
  isLoggedIn: boolean;
  userData: {
    name: string;
    id: string;
  };
}

// Define the initial state using that type
const initialState: InitState = {
  isLoggedIn: false,
  userData: {id: '', name: ''},
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, {payload}: PayloadAction) => {
      state.isLoggedIn = true;
      state.userData = {
        id: payload?.id as string,
        name: payload?.name as string,
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
