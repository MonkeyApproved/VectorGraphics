import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import mathSlice from './math/slice';
import userInterfaceSlice from './userInterface/slice';
import canvasSlice from './canvas/slice';
import spreadsheetSlice from './spreadsheet/slice';
import dataExplorerSlice from './dataExplorer/slice';
import variableManagerSlice from './variableManager/slice';

const rootReducer = combineSlices(
  mathSlice,
  variableManagerSlice,
  userInterfaceSlice,
  canvasSlice,
  spreadsheetSlice,
  dataExplorerSlice,
);
export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();

export default store;

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
