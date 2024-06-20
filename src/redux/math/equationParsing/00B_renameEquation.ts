import { Equation } from '.';
import { Context } from '../context';
import { MathState } from '../mathSlice';
import { removeEquationContextFromChildren } from './00C_removeEquation';
import getDependencyMap from './06_dependencyMap';
import computeAllResults from './07_computeResult';
import { getEquation } from './getEquation';
import { retrieveExistingDependencies } from './unknownReference';

export default function changeEquationContext({
  oldContext,
  newName,
  state,
}: {
  oldContext: Context;
  newName: string;
  state: MathState;
}): void {
  // check if the name actually changed. If not, we can cut this short...
  if (oldContext.name === newName) {
    return;
  }

  // check that the new context is not already taken
  const existingEquation = getEquation({ context: { ...oldContext, name: newName }, state });
  if (existingEquation) {
    throw new Error(`Equation with name ${newName} already exists in namespace ${oldContext.namespace}`);
  }

  // find the equation to rename
  const equation = state.variables[oldContext.namespace].equations[oldContext.name];
  if (!equation) {
    throw new Error(`Equation with name ${oldContext.name} not found`);
  }

  // rename the equation, while updating all old and new dependencies
  renameEquation({ equation, newName, state });
}

function renameEquation({ equation, newName, state }: { equation: Equation; newName: string; state: MathState }): void {
  // first we remove the current equation context from all equation dependencies (replacing it with an unknown context)
  removeEquationContextFromChildren({ equation, state });

  // now we can safely update the equation context
  delete state.variables[equation.context.namespace].equations[equation.context.name];
  equation.context.name = newName;
  state.variables[equation.context.namespace].equations[newName] = equation;

  // we have to check if the new context already has known children (the old children can be removed)
  const existingDependencies = retrieveExistingDependencies({ context: equation.context, state });
  equation.dependencies.children = existingDependencies.children;

  // lastly, we have to calculate the result of the equation and all it's affected equations
  const dependencyMap = getDependencyMap({ dependencyMap: [], context: equation.context, state });
  computeAllResults({ context: equation.context, dependencyMap, state });
}
