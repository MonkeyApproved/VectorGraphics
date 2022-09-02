import { configureStore } from '@reduxjs/toolkit';
import svgSlice from './svgStore/svgSlice';

const store = configureStore({
  reducer: {
    svg: svgSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
