import { MathState } from '../slice';
import computeAllResults from './07_computeResult';
import { getExistingEquation } from './getEquation';
import { Equation } from './types';
import { Context } from '../context';
import getDependencyMap, { getAffectedEquation, markCyclicDependency } from './06_dependencyMap';
import parseEquationInput from './01_parseEquationInput';

function resetEquationEvaluation({ equation }: { equation: Equation }) {
  equation.errorMessage = undefined;
  equation.tokens = [];
  equation.rpn = [];
}

export default function updateExistingEquation({
  context,
  value,
  state,
}: {
  context: Context;
  value: string | number;
  state: MathState;
}) {
  const equation: Equation = getExistingEquation({ context, state });
  resetEquationEvaluation({ equation });

  // parse the input and update tokens, rpn and dependencies
  parseEquationInput({ equation, value, state });

  // get a map of all affected dependencies
  const dependencyMap = getDependencyMap({ dependencyMap: [], context, state });
  if (getAffectedEquation({ dependencyMap, child: context })) {
    // the equation depends on itself -> cyclic dependency, meaning none of the equations can be resolved.
    return markCyclicDependency({ dependencyMap, state });
  }

  // compute result of equation and all modified children
  computeAllResults({ context, dependencyMap, state });
}
