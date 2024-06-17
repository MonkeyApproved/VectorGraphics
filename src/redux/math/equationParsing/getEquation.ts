import { EquationDict, MathState } from '../mathSlice';
import updateExistingEquation from './00_setEquationInput';
import { Context, Equation } from './types';
import { retrieveExistingDependencies } from './unknownReference';

export default function getNewEquation({
  context,
  value,
  state,
}: {
  context: Context;
  value?: string;
  state: MathState;
}): void {
  // if this equation was already referenced before, it was already added to the undefined namespace
  state.variables[context.namespace].equations[context.name] = {
    version: 0,
    context,
    input: undefined,
    dependencies: retrieveExistingDependencies({ context, state }),
  };
  if (value !== undefined) {
    updateExistingEquation({ context, value, state });
  }
}

export function getNamespaceEquations({ state, namespace }: { state: MathState; namespace: string }): EquationDict {
  if (!state.variables[namespace]) {
    throw new Error(`Namespace with id ${namespace} does not exist`);
  }
  return state.variables[namespace].equations;
}

export function getEquation({ context, state }: { context: Context; state: MathState }): Equation | undefined {
  /**
   * Get equation matching context.
   */
  const equationDict = getNamespaceEquations({ state, namespace: context.namespace });
  return equationDict[context.name];
}

export function getExistingEquation({ context, state }: { context: Context; state: MathState }): Equation {
  /**
   * Get equation matching context.
   */
  const equationDict = getNamespaceEquations({ state, namespace: context.namespace });
  if (!equationDict[context.name]) {
    throw new Error(`Equation with id ${context.name} does not exist in namespace ${context.namespace}`);
  }
  return equationDict[context.name];
}

export function getEquationById({ equationId, state }: { equationId: string; state: MathState }): Equation | undefined {
  for (const namespace in state.variables) {
    if (equationId in state.variables[namespace].equations) {
      return state.variables[namespace].equations[equationId];
    }
  }
  return undefined;
}

export function getExistingEquationById({ equationId, state }: { equationId: string; state: MathState }): Equation {
  const equation = getEquationById({ equationId, state });
  if (equation) {
    return equation;
  }
  throw new Error(`Equation with id ${equationId} does not exist in any namespace`);
}

export function getAllEquationIds({ state }: { state: MathState }): Set<string> {
  const ids: Set<string> = new Set();
  for (const namespace in state.variables) {
    for (const equationId in state.variables[namespace].equations) {
      ids.add(equationId);
    }
  }
  return ids;
}
