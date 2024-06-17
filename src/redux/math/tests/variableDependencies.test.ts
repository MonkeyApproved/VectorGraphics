import { AppStore, makeStore } from '../../store';
import {
  addEquationToStore,
  compareResults,
  getEquationFromStore,
  initialMathStates,
  updateEquationInStore,
} from './test.helper';
import { Equation } from '..';
import { equationError } from '../equationParsing/errors';

function checkForCyclicDependency({ equation }: { equation: Equation }) {
  expect(equation.errorMessage).toBeDefined();
  expect(equation.result).toBeUndefined();
  expect(equation.errorMessage).toEqual(equationError.cyclicDependency);
}

describe('Erroneous variable dependencies', () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore({ math: initialMathStates.default });
  });

  it(`correctly identifies single missing variable`, () => {
    addEquationToStore({ store, name: 'A', value: '1' });

    // set up equation X with missing variable B
    const equationX = addEquationToStore({ store, name: 'X', value: 'A+B' });
    expect(equationX).toBeDefined();
    expect(equationX?.errorMessage).toBeDefined();
    expect(equationX?.errorMessage).toEqual(equationError.unknownVariables({ unknownVariables: ['B'] }));
  });

  it(`correctly identifies multiple missing variables`, () => {
    addEquationToStore({ store, name: 'A', value: '1' });
    addEquationToStore({ store, name: 'B', value: 'A+4' });

    // set up equation X with missing variable C and D
    const equationX = addEquationToStore({ store, name: 'X', value: '(A+C)/(B+D)' });
    expect(equationX).toBeDefined();
    expect(equationX?.errorMessage).toBeDefined();
    expect(equationX?.errorMessage).toEqual(equationError.unknownVariables({ unknownVariables: ['C', 'D'] }));
  });

  it(`correctly identifies parent variables that have no result`, () => {
    addEquationToStore({ store, name: 'A', value: ')1+(' });
    addEquationToStore({ store, name: 'B', value: 'A+1' });

    // set up equation X with undefined variable A and B
    const equationX = addEquationToStore({ store, name: 'X', value: 'A+B' });
    expect(equationX).toBeDefined();
    expect(equationX?.errorMessage).toBeDefined();
    expect(equationX?.errorMessage).toEqual(equationError.undefinedVariables({ undefinedVariables: ['A', 'B'] }));
  });

  it(`correctly identifies circular dependencies between 2 variables`, () => {
    // test case A=B and B=A
    addEquationToStore({ store, name: 'A', value: 'B' });
    addEquationToStore({ store, name: 'B', value: 'A' });

    // check that both A and B are marked for their cyclic dependency
    checkForCyclicDependency({ equation: getEquationFromStore({ store, name: 'A' }) });
    checkForCyclicDependency({ equation: getEquationFromStore({ store, name: 'B' }) });
  });

  it(`correctly identifies circular dependencies between multiple variables`, () => {
    // test case A=B, B=C, ... F=G, G=A
    const chain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'];
    for (let i = 0; i < chain.length - 1; i++) {
      addEquationToStore({ store, name: chain[i], value: chain[i + 1] });
    }

    // check that all variables are marked for their cyclic dependency
    for (let i = 0; i < chain.length - 1; i++) {
      checkForCyclicDependency({ equation: getEquationFromStore({ store, name: chain[i] }) });
    }
  });
});

describe('Changing variable dependencies', () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore({ math: initialMathStates.default });
  });

  it(`correctly updates variable dependencies`, () => {
    addEquationToStore({ store, name: 'A', value: '1' });
    addEquationToStore({ store, name: 'B', value: 'A+4' });

    // set up equation X with missing variable C and D
    const equationX = addEquationToStore({ store, name: 'X', value: '(A+C)/(B+D)' });
    expect(equationX?.errorMessage).toEqual(equationError.unknownVariables({ unknownVariables: ['C', 'D'] }));

    // add missing variables C and D
    addEquationToStore({ store, name: 'C', value: 'B+2' });
    addEquationToStore({ store, name: 'D', value: '-1' });

    // check that equation X now has a result
    const updatedEquationX = getEquationFromStore({ store, name: 'X' });
    expect(updatedEquationX?.errorMessage).toBeUndefined();
    compareResults({ result1: updatedEquationX.result, result2: 2 });
  });

  it(`detects if circular dependencies have been resolved`, () => {
    // same scenario as in previous test, but this time we break the circular dependency afterwards
    const chain = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'];
    for (let i = 0; i < chain.length - 1; i++) {
      addEquationToStore({ store, name: chain[i], value: chain[i + 1] });
    }
    // fix the value of any equation, breaking the circular dependency
    updateEquationInStore({ store, name: 'D', value: '42' });

    // all equations should now compute to the same value as D
    for (let i = 0; i < chain.length - 1; i++) {
      const equation = getEquationFromStore({ store, name: chain[i] });
      compareResults({ result1: equation.result, result2: 42 });
    }
  });
});
