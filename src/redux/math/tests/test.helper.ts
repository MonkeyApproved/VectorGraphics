import { AppStore } from 'src/redux/store';
import { Context, Equation, Result } from 'src/redux/math';
import { MathState, addEquation, initialState, updateEquationValue } from '../mathSlice';
import { getEquation } from '../selectors';

export function getVariableContext(name: string): Context {
  return {
    type: 'variable',
    namespace: 'variables',
    name,
  };
}

export const initialMathStates: { [key: string]: MathState } = {
  default: initialState,
};

export const equationContext: { [key: string]: Context } = {
  variable_A: getVariableContext('A'),
  variable_B: getVariableContext('B'),
  variable_C: getVariableContext('C'),
  variable_X: getVariableContext('X'),
};

interface addEquationProps {
  store: AppStore;
  name: string;
  value: string;
}

export function addEquationToStore({ store, name, value }: addEquationProps): Equation {
  const context = getVariableContext(name);
  store.dispatch(addEquation({ context, value }));
  return getEquationFromStore({ store, name });
}

export function updateEquationInStore({ store, name, value }: addEquationProps): Equation {
  const context = getVariableContext(name);
  store.dispatch(updateEquationValue({ context, value }));
  return getEquationFromStore({ store, name });
}

interface getEquationProps {
  store: AppStore;
  name: string;
}

export function getEquationFromStore({ store, name }: getEquationProps): Equation {
  const context = getVariableContext(name);
  const equation = getEquation(context)(store.getState());
  expect(equation).toBeDefined();
  return equation as Equation;
}

export function compareResults({ result1, result2 }: { result1: Result; result2: Result }) {
  if (result1 === undefined || result2 === undefined) {
    expect(result1).toStrictEqual(result2);
  } else if (Number.isInteger(result1)) {
    expect(result1).toStrictEqual(result2);
  } else if (Number.isNaN(result1)) {
    expect(result2).toBeNaN();
  } else if (Array.isArray(result2)) {
    expect(Array.isArray(result1)).toBeTruthy();
    expect(result1).toHaveLength(result2.length);
    result2.forEach((element, i) => {
      // do the same check for each element of the array separately
      compareResults({ result1: (result1 as number[])[i], result2: element });
    });
  } else {
    expect(result1).toBeCloseTo(result2, 6);
  }
}
