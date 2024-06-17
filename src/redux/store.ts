import { combineSlices, configureStore } from '@reduxjs/toolkit';
import mathSlice from './math/mathSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const rootReducer = combineSlices(mathSlice);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export default store;

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
