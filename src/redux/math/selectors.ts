import { RootState } from '../store';
import { Equation, getNumberFromEquation } from './equationParsing';
import { getEquationById, getExistingEquation } from './equationParsing/getEquation';
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

export const checkIfEquationIdExists =
  (id: string) =>
  (state: RootState): boolean => {
    const equation = getEquationById({ equationId: id, state: state.math });
    if (!equation) return false; // no equation with this id
    if (equation.input === undefined) return false; // equation exists, but no input, meaning it is only placeholder for children dependencies
    return true;
  };
