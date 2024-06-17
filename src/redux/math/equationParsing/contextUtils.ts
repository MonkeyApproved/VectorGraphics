import { VARIABLE_NAMESPACE } from 'src/redux/variableManager/context';
import { Context } from '..';
import { addUnknownReference } from './unknownReference';
import { MathState } from '../mathSlice';

export function findMatchingContext({ context, contextList }: { context: Context; contextList: Context[] }) {
  return contextList.find((c) => context.name === c.name && context.namespace === c.namespace);
}

export function deleteContext({ context, contextList }: { context: Context; contextList: Context[] }) {
  const index = contextList.findIndex((c) => context.name === c.name && context.namespace === c.namespace);
  if (index > -1) {
    contextList.splice(index, 1);
  }
}

/**
 * Get the context of a dependency based on the variable-name used in the equation.
 *
 * In order to find the correct context, we check for the variable-name in:
 *  - The namespace matching the one of the equation.
 *  - The variable namespace (if different from equation namespace).
 *    All equations can always refer to this namespace.
 *  - Lastly, if the dependency is not found in any of the namespaces, an unknown reference is added
 *    to the math.unknownReferences namespace and the corresponding context is returned.
 *
 * @param {Object} params - Parameters
 * @param {string} params.name - Name of the dependency
 * @param {Context} params.equationContext - Context of the equation that is referencing the dependency
 * @param {MathState} params.state - Current state of the math slice
 * @returns {Context} The context of the dependency
 */
export function getDependencyContext({
  name,
  equationContext,
  state,
}: {
  name: string;
  equationContext: Context;
  state: MathState;
}): Context {
  // check for matching context in the equations namespace
  const equationNamespace = state.variables[equationContext.namespace];
  if (equationNamespace?.equations[name]) {
    return equationNamespace.equations[name].context;
  }

  // check if the equation is not in the variable namespace -> if so, we need to check there as well
  if (equationContext.namespace !== VARIABLE_NAMESPACE) {
    // check in the variable context (as this can be referenced anywhere)
    const variableNamespace = state.variables[VARIABLE_NAMESPACE];
    if (variableNamespace.equations[name]) {
      return variableNamespace.equations[name].context;
    }
  }

  // this dependency is not yet defined -> return an undefined context
  return addUnknownReference({ reference: name, child: equationContext, state });
}
