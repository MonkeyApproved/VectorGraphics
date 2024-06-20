import { Context } from './context';
import {
  getNewEquation,
  changeEquationContext,
  updateExistingEquation,
  removeExistingEquation,
} from './equationParsing';
import { MathSliceReducer } from './mathSlice';

const updateEquationValue: MathSliceReducer<{ context: Context; value: string }> = (state, { payload }) => {
  updateExistingEquation({ context: payload.context, value: payload.value, state });
};

const addEquation: MathSliceReducer<{ context: Context; value: string }> = (state, { payload }) => {
  getNewEquation({ context: payload.context, value: payload.value, state });
};

const renameEquation: MathSliceReducer<{ oldContext: Context; newName: string }> = (state, { payload }) => {
  changeEquationContext({ oldContext: payload.oldContext, newName: payload.newName, state });
};

const removeEquation: MathSliceReducer<{ context: Context }> = (state, { payload }) => {
  removeExistingEquation({ context: payload.context, state });
};

export const reducers = { updateEquationValue, addEquation, renameEquation, removeEquation };
