import { AppStore, makeStore } from 'src/redux/store';
import {
  addEquationToStore,
  compareResults,
  getEquationFromStore,
  getVariableContext,
  initialMathStates,
  updateEquationInStore,
} from './test.helper';
import { Equation } from '../equationParsing';
import { equationError } from '../equationParsing/errors';
import { removeEquation, renameEquation } from '../slice';
import { getEquation } from '../equationParsing/getEquation';

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

describe('Removing equations', () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore({ math: initialMathStates.default });
  });

  it(`correctly removes equation with no dependencies`, () => {
    const context = getVariableContext('A');
    addEquationToStore({ store, name: 'A', value: '1+1' });

    // check that A is gone
    store.dispatch(removeEquation({ context }));
    const equation = getEquation({ context, state: store.getState().math });
    expect(equation).toBeUndefined();
  });

  it(`correctly removes equation with existing children`, () => {
    const context = getVariableContext('A');
    addEquationToStore({ store, name: 'A', value: '1+1' }); // equation to be removed
    addEquationToStore({ store, name: 'B', value: 'A+1' }); // direct dependency
    addEquationToStore({ store, name: 'C', value: 'B+1' }); // indirect dependency

    // check that A is gone
    store.dispatch(removeEquation({ context }));
    const equationA = getEquation({ context, state: store.getState().math });
    expect(equationA).toBeUndefined();

    // check that B & C have been updated to reflect the now missing dependency
    // B should now have an undefined variable A
    const equationB = getEquationFromStore({ store, name: 'B' });
    expect(equationB.errorMessage).toBeDefined();
    expect(equationB.errorMessage).toEqual(equationError.unknownVariables({ unknownVariables: ['A'] }));
    // C should now have an undefined variable B (as B will b undefined)
    const equationC = getEquationFromStore({ store, name: 'C' });
    expect(equationC.errorMessage).toBeDefined();
    expect(equationC.errorMessage).toEqual(equationError.undefinedVariables({ undefinedVariables: ['B'] }));
  });
});

describe('Rename equations', () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore({ math: initialMathStates.default });
  });

  it(`correctly renames equation with no dependencies`, () => {
    const oldContext = getVariableContext('oldA');
    const newContext = getVariableContext('newA');
    addEquationToStore({ store, name: oldContext.name, value: '1+1' });

    // check that A is gone
    store.dispatch(renameEquation({ oldContext, newName: newContext.name }));

    // check that old context is gone
    const equationOld = getEquation({ context: oldContext, state: store.getState().math });
    expect(equationOld).toBeUndefined();

    // check that new context is there and has the correct equation associated
    const equationNew = getEquation({ context: newContext, state: store.getState().math });
    expect(equationNew).toBeDefined();
    expect(equationNew?.errorMessage).toBeUndefined();
    compareResults({ result1: equationNew?.result, result2: 2 });
  });

  it(`correctly renames equation with existing children`, () => {
    // equation to be renamed
    const oldContext = getVariableContext('oldA');
    const newContext = getVariableContext('newA');
    addEquationToStore({ store, name: oldContext.name, value: '1+1' });

    // equations referencing the old name (should initially be defined and then become undefined)
    const initialB = addEquationToStore({ store, name: 'B', value: 'oldA+1' }); // direct dependency oldA
    const initialC = addEquationToStore({ store, name: 'C', value: 'B+1' }); // indirect dependency oldA

    // equations referencing the new name (should initially be undefined and then become defined)
    const initialD = addEquationToStore({ store, name: 'D', value: 'newA+3' }); // direct dependency newA
    const initialE = addEquationToStore({ store, name: 'E', value: 'D+3' }); // indirect dependency newA

    // check initial state
    compareResults({ result1: initialB.result, result2: 3 });
    compareResults({ result1: initialC.result, result2: 4 });
    expect(initialD.errorMessage).toEqual(equationError.unknownVariables({ unknownVariables: ['newA'] }));
    expect(initialE.errorMessage).toEqual(equationError.undefinedVariables({ undefinedVariables: ['D'] }));

    // rename the equation and get all the updated children
    store.dispatch(renameEquation({ oldContext, newName: newContext.name }));
    const finalB = getEquationFromStore({ store, name: 'B' }); // direct dependency oldA
    const finalC = getEquationFromStore({ store, name: 'C' }); // indirect dependency oldA
    const finalD = getEquationFromStore({ store, name: 'D' }); // direct dependency newA
    const finalE = getEquationFromStore({ store, name: 'E' }); // indirect dependency newA

    // check final state
    expect(finalB.errorMessage).toEqual(equationError.unknownVariables({ unknownVariables: ['oldA'] }));
    expect(finalC.errorMessage).toEqual(equationError.undefinedVariables({ undefinedVariables: ['B'] }));
    compareResults({ result1: finalD.result, result2: 5 });
    compareResults({ result1: finalE.result, result2: 8 });
  });
});
