import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

interface InitState {
  projects: any[];
  board: {title: string; id: string};
  task: {title: string; id: string};
  members: InitState['userData'][];
}

// Define the initial state using that type
const initialState: InitState = {
  projects: [],
  board: {title: '', id: ''},
  task: {title: '', id: ''},
  members: [],
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    loadProjects: (state, {payload}) => {
      state.projects = payload;
    },
    setBoard: (state, {payload}) => {
      state.board.title = payload.title;
      state.board.id = payload.id;
    },
    unsetBoard: state => {
      state.board.title = '';
      state.board.id = '';
    },
    setTask: (state, {payload}) => {
      state.task.title = payload.title;
      state.task.id = payload.id;
    },
    unsetTask: state => {
      state.task.title = '';
      state.task.id = '';
    },
    setProjectMembers: (state, {payload}) => {
      state.members = payload;
    },
  },
});

export const {loadProjects, setBoard, setTask, unsetTask, setProjectMembers} =
  projectsSlice.actions;

export const selectProjects = (state: RootState) => state.projects.projects;
export const selectBoard = (state: RootState) => state.projects.board;
export const selectTask = (state: RootState) => state.projects.task;
export const selectMembers = (state: RootState) => state.projects.members;
export default projectsSlice.reducer;
