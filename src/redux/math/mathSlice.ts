import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { reducers } from './reducers';
import { MathFunction, Equation, getFunctionDict } from './equationParsing';
import { VARIABLE_CONTEXT_TYPE, VARIABLE_NAMESPACE } from '../variables/context';
import { MAIN_UNKNOWN_NAMESPACE, UnknownReferencesDict } from './equationParsing/unknownReference';

export interface EquationDict {
  [equationId: string]: Equation;
}

export interface Namespace {
  type: string;
  version: number;
  equations: EquationDict;
}

export interface MathState {
  unknownReferences: { [namespace: string]: UnknownReferencesDict };
  variables: { [namespace: string]: Namespace };
  functions: { [functionName: string]: MathFunction };
}

export const initialState: MathState = {
  unknownReferences: {
    [MAIN_UNKNOWN_NAMESPACE]: {},
  },
  variables: {
    [VARIABLE_NAMESPACE]: {
      type: VARIABLE_CONTEXT_TYPE,
      version: 0,
      equations: {},
    },
  },
  functions: getFunctionDict(),
};

export type MathSliceReducer<PayloadType> = (state: MathState, { payload, type }: PayloadAction<PayloadType>) => void;

const mathSlice = createSlice({
  name: 'math',
  initialState,
  reducers: { ...reducers },
});
export default mathSlice;
export const {
  // equation reducers
  updateEquationValue,
  addEquation,
} = mathSlice.actions;
