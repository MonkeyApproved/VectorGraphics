import { DataSliceReducer } from '../dataSlice';
import { computeAllResults } from './computeResult';
import { updateDependencies } from './dependencies';
import { Equation, getNewEquation } from './equation';
import getTokens from './parseEquation';
import getRPN from './reversePolishNotation';

const submitEquation: DataSliceReducer<{ id: string; input: string }> = (state, { payload }) => {
  let equation: Equation = state.equations[payload.id];
  if (equation) {
    equation.input = payload.input;
  } else {
    // equation with this id does not exist yet -> add new equation
    state.equations[payload.id] = getNewEquation({ id: payload.id, input: payload.input });
    equation = state.equations[payload.id];
  }

  // parse equation
  getTokens({ equation });
  getRPN({ equation });
  updateDependencies({ equation, state });

  // compute result of equation and all modified children
  computeAllResults({ equationId: payload.id, state });
};

export const equationReducers = { submitEquation };
