import { DataSliceReducer } from '../dataSlice';
import computeResult from './computeResult';
import { Equation } from './equation';
import getTokens from './parseEquation';
import getRPN from './reversePolishNotation';

const addEquation: DataSliceReducer<{ id: string; equation: string }> = (state, { payload }) => {
  // evaluate equation
  const equation: Equation = { input: payload.equation };
  getTokens({ equation });
  getRPN({ equation });
  computeResult({ equation });

  // add equation to store
  state.equations[payload.id] = equation;
};

export const equationReducers = { addEquation };
