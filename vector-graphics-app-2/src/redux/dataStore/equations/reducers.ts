import { DataSliceReducer } from '../dataSlice';
import computeResult from './computeResult';
import { hasError } from './equation';
import getTokens from './parseEquation';
import getRPN from './reversePolishNotation';

const addEquation: DataSliceReducer<{ id: string; equation: string }> = (state, { payload }) => {
  const tokens = getTokens({ equation: payload.equation });
  const error = hasError({ tokens });
  if (error) {
    state.equations[payload.id] = {
      input: payload.equation,
      tokens,
      error,
    };
    return;
  }
  const rpn = getRPN({ tokens });
  const result = computeResult({ rpn });
  state.equations[payload.id] = {
    input: payload.equation,
    tokens,
    error,
    rpn,
    result,
  };
};

export const equationReducers = { addEquation };
