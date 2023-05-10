import { RootState } from 'redux/store';
import { Equation } from './equation';

export const getEquationById =
  (id: string | undefined) =>
  (state: RootState): Equation | undefined => {
    if (!id) return undefined;
    return state.data.equations[id];
  };

export const checkIfEquationIdExists =
  (id: string) =>
  (state: RootState): boolean => {
    if (!(id in state.data.equations)) return false; // no equation with this id
    if (state.data.equations[id].input === undefined) return false; // equation exists, but no input, meaning it is only placeholder for children dependencies
    return true;
  };
