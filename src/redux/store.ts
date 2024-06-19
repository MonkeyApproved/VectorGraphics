import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { mathSlice } from './math';
import { userInterfaceSlice } from './userInterface';
import { canvasSlice } from './canvas';
import { spreadsheetSlice } from './spreadsheet';
import { dataExplorerSlice } from './dataExplorer';
import { variableManagerSlice } from './variableManager';

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
