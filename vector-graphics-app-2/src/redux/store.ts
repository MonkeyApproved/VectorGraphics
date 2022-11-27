import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './dataStore/dataSlice';

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
