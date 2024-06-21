import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { VariableManager } from './manager';

export interface VariableManagerState {
  managerCounter: number;
  managers: { [key: string]: VariableManager };
}

export const initialVariableManagerState: VariableManagerState = {
  managerCounter: 0,
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
  initialState: initialVariableManagerState,
  reducers: { ...reducers },
});
export default variableManagerSlice;
export const {
  // managers
  addVariableManager,
  removeVariableManager,
  // variables
  addVariableToVariableManager,
  removeVariableFromVariableManager,
} = variableManagerSlice.actions;
