import { Tabs } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';

export interface UiState {
  tabCounter: number;
  tabs: Tabs;
}

export const initialUserInterfaceState: UiState = {
  tabCounter: 0,
  tabs: { type: 'single', tabs: [] },
};

export type UiSliceReducer<PayloadType> = (state: UiState, { payload, type }: PayloadAction<PayloadType>) => void;

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUserInterfaceState,
  reducers: { ...reducers },
});
export default uiSlice;
export const { addNewTab, removeTab, moveTab, changeTabAreaType } = uiSlice.actions;
