import { DataState } from '../dataSlice';
import {
  collectDependentChildren,
  markCyclicDependency,
  removeEquationFromDependencyMap,
  updateDependencies,
} from './dependencies';
import { Equation, getNewEquation, setEquationResult } from './equation';
import { fixTokens } from './fixTokens';
import getTokens from './parseEquation';
import getRPN from './reversePolishNotation';
import { computeEquationResult } from './computeResult';
import { applyElementEquationChanges } from '../svg/applyAttributes';

export function updateEquationInput({
  equationId,
  value,
  state,
}: {
  equationId: string;
  value: string | number;
  state: DataState;
}) {
  let equation: Equation = state.equations[equationId];
  if (!equation) {
    // equation with this id does not exist yet -> add new equation
    state.equations[equationId] = getNewEquation({ id: equationId });
    equation = state.equations[equationId];
  }

  equation.errorMessage = undefined;
  equation.tokens = [];
  equation.rpn = [];

  if (typeof value == 'number') {
    // a number, not an equation (string) was passed -> no need to evaluate result
    setEquationResult({ equation, result: value });
    equation.dependencies.parents = [];
  } else {
    // if a real equation is passed, we evaluate it
    equation.input = value;

    // parse equation
    getTokens({ equation });
    fixTokens({ equation });
    getRPN({ equation });
  }

  // check for new or deprecated parents
  updateDependencies({ equation, state });

  // compute result of equation and all modified children
  computeAllResults({ equationId, state });
}

export function computeAllResults({ equationId, state }: { equationId: string; state: DataState }) {
  const dependencyMap = collectDependentChildren({ dependencyMap: {}, equationId, state });
  const affectedSvgElements = new Set<string>();
  if (dependencyMap[equationId]) {
    // the equation depends on itself -> cyclic dependency, meaning none of the equations can be resolved.
    markCyclicDependency({ dependencyMap, state });
    return;
  }

  let equationReadyForEvaluation: string | undefined = equationId;
  while (equationReadyForEvaluation !== undefined) {
    // evaluate the equation that has no more unresolved dependencies
    const equation = computeEquationResult({ equationId: equationReadyForEvaluation, state });

    // remember all affected svg elements, so that they can be updated at the end
    equation.dependencies.svgUsage?.forEach((property) => affectedSvgElements.add(property.elementId));

    // remove said equation from dependency map and find next equation ready for evaluation
    equationReadyForEvaluation = removeEquationFromDependencyMap({
      dependencyMap,
      equationId: equationReadyForEvaluation,
    });
  }

  // update all dependent svg elements
  affectedSvgElements.forEach((elementId) => applyElementEquationChanges({ elementId, state }));

  // check if all equation have been evaluated (resulting in an empty dependency map)
  if (Object.keys(dependencyMap).length !== 0) {
    markCyclicDependency({ dependencyMap, state });
  }
}
