import { MathState } from '../mathSlice';
import { getEquation } from './getEquation';
import { TokenType } from './tokenUtils/tokenEnums';
import { Equation } from './types';
import { Context } from '../context';
import { UNKNOWN_CONTEXT_TYPE, removeChildFromUnknownReference } from './unknownReference';
import { deleteContext, findMatchingContext, getDependencyContext } from './contextUtils';

/**
 * Update the dependencies of an equation based on the tokens parsed from the equation.
 *
 * This function is called whenever an equation is updated (e.g. when the input is changed).
 * It checks for all variables and cells in the equation and updates the dependencies accordingly.
 * Doing so, it ensures that all parents of the equation are informed about their new child and that
 * all parents that are no longer referenced by the equation are informed about the removal of the child.
 * This is done by comparing the current parents with the previous parents and updating the dependencies accordingly.
 *
 * In order to find the correct context of a dependency, we check for the variable-name in
 *  - the namespace matching the one of the equation,
 *  - the variable namespace,
 *  - the unknown references (where a new one is added if none exists yet).
 *
 * @param {Object} params - Parameters
 * @param {Equation} params.equation - Equation to update
 * @param {MathState} params.state - Current state of the math slice
 * @returns {Equation} The updated equation
 */
export default function updateDependencies({ equation, state }: { equation: Equation; state: MathState }): Equation {
  if (!equation.tokens) return equation;

  // get current parents from token list
  const currentParents: Context[] = [];
  for (const token of equation.tokens) {
    if (!(token.type === TokenType.Variable || token.type === TokenType.Cell)) {
      // only variables and cells are dependencies, all other tokens are "static"
      continue;
    }
    if (currentParents.find((parent) => parent.name === token.name)) {
      // this parent is already in the list, it is referenced multiple times
      continue;
    }

    const parentContext = getDependencyContext({ name: token.name, equationContext: equation.context, state });
    currentParents.push(parentContext);
  }

  // check for any parents that have been removed
  equation.dependencies.parents.forEach((parent: Context) => {
    if (!findMatchingContext({ context: parent, contextList: currentParents })) {
      removeChildFromParent({ parent, child: equation.context, state });
    }
  });

  // check for any new parents that should be informed about their new child
  currentParents.forEach((parent) => {
    if (!findMatchingContext({ context: parent, contextList: equation.dependencies.parents })) {
      addChildToParent({ parent, child: equation.context, state });
    }
  });

  // finally, we can update the equation dependencies with the current parents
  equation.dependencies.parents = Array.from(currentParents);

  return equation;
}

/**
 * Remove a child dependency from a parent equation.
 *
 * This is done, when a child is no longer referencing the parent (e.g. when a variable is removed from an equation).
 * In case the parent is an unknown reference, the child is removed from math.unknownReferences and in case this was
 * the last child, the unknown reference is removed completely.
 *
 * For all of this, we assume that the parent context already exists. Otherwise an exception is raised.
 *
 * @param {Object} params - Parameters
 * @param {Context} params.parent - Parent that was previously referenced by the child, but is not anymore
 * @param {Context} params.child - Child that was previously referencing the parent, but is not anymore
 * @param {MathState} params.state - Current state of the math slice
 * @returns {void} The math-state is updated in place
 */
export function removeChildFromParent({
  parent,
  child,
  state,
}: {
  parent: Context;
  child: Context;
  state: MathState;
}): void {
  // if this is an unknown reference, we need to remove it from the unknown references
  if (parent.type === UNKNOWN_CONTEXT_TYPE) {
    removeChildFromUnknownReference({ child, reference: parent, state });
    return;
  }

  const parentEquation = getEquation({ context: parent, state });
  if (!parentEquation) {
    // in updateDependencies() we already ensure that only existing contexts are passed to this function
    throw new Error(`Only existing contexts should have reached this point. Something went wrong...`);
  }

  // remove child from parent equation's dependencies
  const children = parentEquation.dependencies.children;
  deleteContext({ context: child, contextList: children });
}

/**
 * Add a new child dependency to a parent equation.
 *
 * This is done, when a child has a new parent (e.g. when a variable is added to an equation).
 * In case the parent context.type is UNKNOWN_CONTEXT_TYPE, nothing is done, as we assume, that the
 * unknown reference was already added by the caller, when getting the parent context.
 *
 * We assume that the parent context already exists. Otherwise an exception is raised.
 *
 * @param {Object} params - Parameters
 * @param {Context} params.parent - Parent that is referenced by the child
 * @param {Context} params.child - Child the parent
 * @param {MathState} params.state - Current state of the math slice
 * @returns {void} The math-state is updated in place
 */
export function addChildToParent({
  parent,
  child,
  state,
}: {
  parent: Context;
  child: Context;
  state: MathState;
}): void {
  // if this is an unknown reference, we don't need to do anything, as the equationContext was already added by addUnknownReference()
  if (parent.type === UNKNOWN_CONTEXT_TYPE) return;

  const parentEquation = getEquation({ context: parent, state });
  if (!parentEquation) {
    // in updateDependencies() we already ensure that only existing contexts are passed to this function
    throw new Error(`Only existing contexts should have reached this point. Something went wrong...`);
  }

  // add child to dependencies if it is not already there
  const currentChildren = parentEquation.dependencies.children;
  if (!findMatchingContext({ context: child, contextList: currentChildren })) {
    currentChildren.push(child);
  }
}
