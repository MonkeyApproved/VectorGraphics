import { Tabs } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';

export interface UiState {
  tabs: Tabs;
}

export const initialState: UiState = {
  tabs: { type: 'single', tabs: [] },
};

export type UiSliceReducer<PayloadType> = (state: UiState, { payload, type }: PayloadAction<PayloadType>) => void;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: { ...reducers },
});
export default uiSlice;
export const {} = uiSlice.actions;
