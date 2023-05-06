import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import teamReducer from './team/slice';
import settingsReducer from './settings/slice';
import projectsReducer from './projects/slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const themePersistConfig = {
  key: 'com.manager/db/persist/settings',
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    user: authReducer,
    team: teamReducer,
    settings: persistReducer(themePersistConfig, settingsReducer),
    projects: projectsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
