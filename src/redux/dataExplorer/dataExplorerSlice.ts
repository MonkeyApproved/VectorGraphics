import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';

export interface DataExplorerState {
  dataSets: string[];
}

export const initialState: DataExplorerState = {
  dataSets: [],
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
