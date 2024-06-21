import { RootState } from '../store';
import { Equation, getNumberFromEquation } from './equationParsing';
import { getExistingEquation } from './equationParsing/getEquation';
import { Context } from './context';

export const getEquation =
  (context: Context) =>
  (state: RootState): Equation | undefined => {
    return getExistingEquation({ context, state: state.math });
  };

export const getEquationResult =
  (context: Context) =>
  (state: RootState): number => {
    return getNumberFromEquation({ context, state: state.math });
  };
