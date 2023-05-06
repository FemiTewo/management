import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface InitState {
  theme: 'dark' | 'light';
}

// Define the initial state using that type
const initialState: InitState = {
  theme: 'light',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {switchTheme} = settingsSlice.actions;

export const selectTheme = (state: RootState) => state.settings.theme;
export default settingsSlice.reducer;
