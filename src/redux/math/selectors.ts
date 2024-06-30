import { RootState } from '../store';
import { Equation, getNumberFromEquation } from './equationParsing';
import { getEquation, getExistingEquation as getExistingEquationHelper } from './equationParsing/getEquation';
import { Context } from './context';
import { Namespace } from '../types';

export const getEquationOrUndefined =
  (context: Context) =>
  (state: RootState): Equation | undefined => {
    return getEquation({ context, state: state.math });
  };

export const getExistingEquation =
  (context: Context) =>
  (state: RootState): Equation | undefined => {
    return getExistingEquationHelper({ context, state: state.math });
  };

export const getNamespaceOrUndefined =
  ({ namespace }: { namespace: string }) =>
  (state: RootState): Namespace | undefined => {
    return state.math.variables[namespace];
  };

export const getEquationResult =
  (context: Context) =>
  (state: RootState): number => {
    return getNumberFromEquation({ context, state: state.math });
  };
