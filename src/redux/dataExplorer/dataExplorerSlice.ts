import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { DataExplorer } from './types';

export interface DataExplorerState {
  dataSets: { [key: string]: DataExplorer };
}

export const initialState: DataExplorerState = {
  dataSets: {},
};

export type DataExplorerSliceReducer<PayloadType> = (
  state: DataExplorerState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const dataExplorerSlice = createSlice({
  name: 'dataExplorer',
  initialState,
  reducers: { ...reducers },
});
export default dataExplorerSlice;
export const {} = dataExplorerSlice.actions;
