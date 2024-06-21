import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { DataExplorer } from './explorer';

export interface DataExplorerState {
  explorerCounter: number;
  dataSets: { [key: string]: DataExplorer };
}

export const initialDataExplorerState: DataExplorerState = {
  explorerCounter: 0,
  dataSets: {},
};

export type DataExplorerSliceReducer<PayloadType> = (
  state: DataExplorerState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const dataExplorerSlice = createSlice({
  name: 'dataExplorer',
  initialState: initialDataExplorerState,
  reducers: { ...reducers },
});
export default dataExplorerSlice;
export const { addDataExplorer, removeDataExplorer } = dataExplorerSlice.actions;
