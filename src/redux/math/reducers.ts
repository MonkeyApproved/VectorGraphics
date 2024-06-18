import { Context } from './context';
import { getNewEquation, renameExistingEquation, updateExistingEquation } from './equationParsing';
import { MathSliceReducer } from './mathSlice';

const updateEquationValue: MathSliceReducer<{ context: Context; value: string }> = (state, { payload }) => {
  updateExistingEquation({ context: payload.context, value: payload.value, state });
};

const addEquation: MathSliceReducer<{ context: Context; value: string }> = (state, { payload }) => {
  getNewEquation({ context: payload.context, value: payload.value, state });
};

const renameEquation: MathSliceReducer<{ oldContext: Context; newContext: Context }> = (state, { payload }) => {
  renameExistingEquation({ oldContext: payload.oldContext, newContext: payload.newContext, state });
};

export const reducers = { updateEquationValue, addEquation, renameEquation };
