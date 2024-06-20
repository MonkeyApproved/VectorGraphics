import { Equation } from '.';
import { Context } from '../context';
import { MathState } from '../mathSlice';
import getDependencyMap, {
  markCyclicDependency,
  removeAffectedEquation,
  removeContextFromDependencyMap,
} from './06_dependencyMap';
import computeAllResults from './07_computeResult';
import { getEquation } from './getEquation';
import { markEquationContextAsUnknown } from './unknownReference';

export default function removeExistingEquation({ context, state }: { context: Context; state: MathState }): void {
  // check that the new context is not already taken
  const equation = getEquation({ context, state });
  if (!equation) {
    throw new Error(`Equation with name ${context.name} not found`);
  }

  // first we remove the equation context from all equation dependencies (replacing it with an unknown context)
  removeEquationContextFromChildren({ equation, state });

  // now we can safely remove the equation from the namespace
  delete state.variables[context.namespace].equations[context.name];
}

export function removeEquationContextFromChildren({ equation, state }: { equation: Equation; state: MathState }): void {
  // get the dependency map of the context to remove
  const dependencyMap = getDependencyMap({ dependencyMap: [], context: equation.context, state });

  // make sure the context to remove is not listed in the dependency map (in case of cyclic dependency)
  removeAffectedEquation({ child: equation.context, dependencyMap });

  // check if there are any affected equations
  if (dependencyMap.length === 0) {
    return;
  }

  // we have to inform all parents and children about this change and make the children reference an unknown context
  markEquationContextAsUnknown({ equation, state });

  // we can now remove the old context from the dependency map
  // at the same time, we already check for any affected equations, that are ready for evaluation
  const equationReadyForEvaluation = removeContextFromDependencyMap({
    context: equation.context,
    dependencyMap,
  });

  // now we are ready to update all affected equations.
  if (!equationReadyForEvaluation) {
    // if none of the affected equations is ready, there must be a cyclic dependency
    markCyclicDependency({ dependencyMap, state });
  } else {
    // we can evaluate all affected equation anew, all of them will be invalid, as they depend on the removed context
    computeAllResults({ context: equationReadyForEvaluation, dependencyMap, state });
  }
}
