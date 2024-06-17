import { MathState } from '../mathSlice';
import getTokens from './01_parseEquation';
import fixTokens from './02_fixTokens';
import getRPN from './03_reversePolishNotation';
import computeAllResults from './06_computeResult';
import updateDependencies from './04_updateDependencies';
import { getExistingEquation } from './getEquation';
import { setEquationResult } from './setResult';
import { Context, Equation } from './types';
import getDependencyMap, { getAffectedEquation, markCyclicDependency } from './05_dependencyMap';

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

  if (typeof value == 'number') {
    // a number, not an equation (string) was passed -> no need to evaluate result
    setEquationResult({ equation, result: value });
    equation.dependencies.parents = [];
  } else {
    // if a real equation is passed, we evaluate it
    equation.input = value;

    // parse equation
    getTokens({ equation, state });
    fixTokens({ equation });
    getRPN({ equation });
  }

  // check for new or deprecated parents
  updateDependencies({ equation, state });

  // get a map of all affected dependencies
  const dependencyMap = getDependencyMap({ dependencyMap: [], context, state });
  if (getAffectedEquation({ dependencyMap, child: context })) {
    // the equation depends on itself -> cyclic dependency, meaning none of the equations can be resolved.
    return markCyclicDependency({ dependencyMap, state });
  }

  // compute result of equation and all modified children
  computeAllResults({ context, dependencyMap, state });
}
