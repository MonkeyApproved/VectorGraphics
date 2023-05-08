import { DataSliceReducer } from '../dataSlice';
import { updateEquationInput } from './updateEquation';

const submitEquation: DataSliceReducer<{ id: string; input: string }> = (state, { payload }) => {
  updateEquationInput({ equationId: payload.id, value: payload.input, state });
};

export const equationReducers = { submitEquation };
