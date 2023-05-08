import { DataState } from '../dataSlice';
import { Dependencies } from './dependencies';
import { RpnToken, Token } from './tokenTypes';
import { computeAllResults } from './updateEquation';

export type Result = number | number[] | undefined;

export interface Equation {
  id: string;
  input?: string;
  dependencies: Dependencies;
  tokens?: Token[];
  errorMessage?: string;
  rpn?: RpnToken[];
  result?: Result;
  lastValidNumber?: number;
}

export interface EquationDict {
  [id: string]: Equation;
}

export function getNewEquation({ id, input }: { id: string; input?: string }): Equation {
  return { id, input, dependencies: { children: [], parents: [] } };
}

export function setEquationError({ equation, errorMessage }: { equation: Equation; errorMessage: string }) {
  equation.errorMessage = errorMessage;
  equation.result = undefined;
  return equation;
}

export function setEquationResult({ equation, result }: { equation: Equation; result: Result }) {
  equation.result = result;
  if (typeof result === 'number' && !isNaN(result)) {
    equation.lastValidNumber = result;
  }
}

export function getNumberFromEquation({ equationId, state }: { equationId: string; state: DataState }): number {
  const equation = state.equations[equationId];
  return equation?.lastValidNumber || NaN;
}

export interface RenameIdProps {
  oldId: string;
  newId: string;
  state: DataState;
}

export function renameEquation({ oldId, newId, state }: RenameIdProps): void {
  if (!(oldId in state.equations)) return; // ERROR: oldId should have existed

  // check if equation under newId already has children (those need to be maintained) or has an input (error)
  let childrenNewId: string[] = [];
  if (newId in state.equations) {
    if (state.equations[newId].input) return; // ERROR: newId already has an existing input value
    childrenNewId = [...state.equations[newId].dependencies.children];
  }

  // register equation under new id (at this point both, old and new, ids will point to the equation)
  state.equations[newId] = state.equations[oldId];

  // remove equation from the oldId
  if (state.equations[oldId].dependencies.children.length > 0) {
    // any children referencing the oldId should remain there, while the input and everything else moves to newId
    state.equations[oldId] = {
      id: oldId,
      input: undefined,
      dependencies: { children: state.equations[newId].dependencies.children, parents: [] },
    };

    // now that the children have been properly reassigned, they have to be evaluated with the new dependencies
    // all those children will have at least a missing dependency now
    computeAllResults({ equationId: oldId, state });
  } else {
    // no children -> the equation under oldId can be deleted
    delete state.equations[oldId];
  }

  // as the oldId got all required information now, we can set id and and children of the newId correctly
  state.equations[newId].id = newId;
  state.equations[newId].dependencies.children = childrenNewId;

  // if any children already referenced the newId, those can now be evaluated
  if (childrenNewId.length > 0) {
    computeAllResults({ equationId: newId, state });
  }

  // finally, we can inform the parents of our equation about the name change
  state.equations[newId].dependencies.parents.forEach((parentId: string) => {
    const children = state.equations[parentId].dependencies.children;
    const index = children.indexOf(oldId);
    children[index] = newId;
  });
}
