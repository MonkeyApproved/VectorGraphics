import { Context } from '..';
import { MathState } from '../mathSlice';
import { deleteContext, findMatchingContext } from './contextUtils';
import { equationError, setEquationError } from './errors';
import { getEquation } from './getEquation';

export interface AffectedEquation {
  context: Context;
  changedParents: Context[];
}

export type DependencyMap = AffectedEquation[];

/**
 * This function collects all equations where at least one of the parents has changed.
 * The keys are the affected equations, the value are the changed parents for that equation.
 * To collect all affected equations, we call this function recursively, passing the dependency map through.
 *
 * @example
 * Assuming, we have following equations:
 * ```ts
 * // This is the input of the equations
 * const A = "5"; // changed
 * const B = "3";
 * const C = "2*B";
 * const D = "B+C+A";
 * ```
 * and equation A has been changed (e.g. from 4 to 5), the dependency map will look like this:
 * ```ts
 * // real context is replaced by a string for better readability
 * const dependencyMap = [
 *  { context: 'C', changedParents: ['A'] },
 *  { context: 'D', changedParents: ['C', 'A'] },
 * ]
 * ```
 *
 * @param {Object} params - Parameters
 * @param {DependencyMap} params.dependencyMap - Current dependency map. Leave empty in initial call.
 * @param {Context} params.context - Context of the equation that has changed
 * @param {MathState} params.state - Current state of the math slice
 * @returns {DependencyMap} The full dependency map
 */
export default function getDependencyMap({
  dependencyMap,
  context,
  state,
}: {
  dependencyMap: DependencyMap;
  context: Context;
  state: MathState;
}): DependencyMap {
  const equation = getEquation({ context, state });
  if (!equation) return dependencyMap; // might be an unknown reference

  // loop though the children and
  equation.dependencies.children.forEach((child) => {
    let affectedEquation = getAffectedEquation({ child, dependencyMap });
    if (affectedEquation === undefined) {
      // child is not in the dependency map yet -> add it
      affectedEquation = { context: child, changedParents: [] };
      dependencyMap.push(affectedEquation);
    }
    if (!findMatchingContext({ context: context, contextList: affectedEquation.changedParents })) {
      affectedEquation.changedParents.push(context);
      getDependencyMap({ dependencyMap, context: child, state });
    }
  });
  return dependencyMap;
}

/**
 * Get the matching affected equation (based on child) from the dependency map.
 *
 * @param {Object} params - Parameters
 * @param {Context} params.child - Child context
 * @param {DependencyMap} params.dependencyMap - Current dependency map
 * @returns {AffectedEquation | undefined} The affected equation or undefined if not found
 */
export function getAffectedEquation({
  child,
  dependencyMap,
}: {
  child: Context;
  dependencyMap: DependencyMap;
}): AffectedEquation | undefined {
  return dependencyMap.find(
    (entry) => entry.context.name === child.name && entry.context.namespace === child.namespace,
  );
}

export function removeAffectedEquation({
  child,
  dependencyMap,
}: {
  child: Context;
  dependencyMap: DependencyMap;
}): void {
  const index = dependencyMap.findIndex(
    (entry) => entry.context.name === child.name && entry.context.namespace === child.namespace,
  );
  if (index === -1) return; // no such child in the dependency map
  dependencyMap.splice(index, 1);
}

/**
 * Remove an equation context from the dependency map.
 *
 * Whenever an equation in the dependency map has no more unresolved parents, it is ready for evaluation.
 * This function removes one such equation context from the dependency map and tries to find another equation
 * with all it's dependencies resolved.
 * If no such equation exists, the return value will be undefined.
 *
 * @param {Object} params - Parameters
 * @param {Context} params.context - Context of the equation to remove
 * @param {DependencyMap} params.dependencyMap - Current dependency map
 * @returns {Context} The context of the next equation, with all dependencies resolved
 */
export function removeContextFromDependencyMap({
  context,
  dependencyMap,
}: {
  context: Context;
  dependencyMap: DependencyMap;
}): Context | undefined {
  let equationReadyForEvaluation: Context | undefined;

  dependencyMap.forEach((affectedEquation) => {
    // remove the context (if present in changed parents list)
    deleteContext({ context, contextList: affectedEquation.changedParents });

    // check if all parents have been resolved
    if (affectedEquation.changedParents.length === 0) {
      // this equation is ready for evaluation
      equationReadyForEvaluation = affectedEquation.context;
    }
  });

  if (equationReadyForEvaluation !== undefined) {
    // remove the equation from the dependency map, as it will be resolved next
    const name = equationReadyForEvaluation.name;
    const namespace = equationReadyForEvaluation.namespace;
    const index = dependencyMap.findIndex(
      (entry) => name === entry.context.name && namespace === entry.context.namespace,
    );
    dependencyMap.splice(index, 1);
  }
  return equationReadyForEvaluation;
}

/**
 * Mark all equations in the dependency map as having a cyclic dependence.
 *
 * This function is called if all remaining equations have unresolved parents left and therefore,
 * no equation can be evaluated anymore.
 *
 * @param {Object} params - Parameters
 * @param {DependencyMap} params.dependencyMap - Current dependency map
 * @param {MathState} params.state - Current state of the math slice
 * @returns {void}
 */
export function markCyclicDependency({
  dependencyMap,
  state,
}: {
  dependencyMap: DependencyMap;
  state: MathState;
}): void {
  dependencyMap.forEach((affectedChild) => {
    const equation = getEquation({ context: affectedChild.context, state });
    if (equation) {
      setEquationError({ equation, errorMessage: equationError.cyclicDependency });
    }
  });
}
