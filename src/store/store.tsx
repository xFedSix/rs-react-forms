import { configureStore } from '@reduxjs/toolkit';
import avatarReducer from './formSlice';

const store = configureStore({
  reducer: {
    avatar: avatarReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
