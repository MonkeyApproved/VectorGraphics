import { EquationDict, MathState } from '../slice';
import updateExistingEquation from './00A_updateEquationInput';
import { Equation } from './types';
import { Context } from '../context';
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
  // check if the namespace already exists and add it if it is new
  if (!state.variables[context.namespace]) {
    state.variables[context.namespace] = {
      type: context.type,
      version: 0,
      equations: {},
    };
  }
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
  const namespace = state.variables[context.namespace];
  if (!namespace) {
    return undefined;
  }
  const equationDict = namespace.equations;
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
