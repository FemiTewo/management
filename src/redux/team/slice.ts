import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface InitState {
  currentTeam: {
    name: string;
    id: string;
  };
}

// Define the initial state using that type
const initialState: InitState = {
  currentTeam: {name: '', id: ''},
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
});

// export const {login} = teamSlice.actions;

export const selectCurrentTeam = (state: RootState) => state.team.currentTeam;
export default teamSlice.reducer;
