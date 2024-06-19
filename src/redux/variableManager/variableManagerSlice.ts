import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { VariableManager } from './types';

export interface VariableManagerState {
  managers: { [key: string]: VariableManager };
}

export const initialState: VariableManagerState = {
  managers: {
    variableManager1: {
      id: 'variableManager1',
      label: 'Variables',
      variables: [],
    },
  },
};

export type VariableManagerSliceReducer<PayloadType> = (
  state: VariableManagerState,
  { payload, type }: PayloadAction<PayloadType>,
) => void;

const variableManagerSlice = createSlice({
  name: 'variableManager',
  initialState,
  reducers: { ...reducers },
});
export default variableManagerSlice;
export const {} = variableManagerSlice.actions;
