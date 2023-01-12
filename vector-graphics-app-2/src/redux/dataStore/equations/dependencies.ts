import { DataState } from '../dataSlice';
import { NumberProperty } from '../svg/element';
import { Equation, setEquationError } from './equation';
import { TokenType } from './tokenEnums';

export interface Dependencies {
  children: string[];
  parents: string[];
  svgUsage?: NumberProperty[];
}

export function updateDependencies({ equation, state }: { equation: Equation; state: DataState }): Equation {
  if (!equation.tokens) return equation;

  // get current parents from token list
  const currentParents: Set<string> = new Set();
  for (const token of equation.tokens) {
    if (token.type !== TokenType.Variable && token.type !== TokenType.Cell) {
      continue;
    }
    currentParents.add(token.name);
  }

  // check for any parents that have been removed
  equation.dependencies.parents.forEach((parent) => {
    if (!currentParents.has(parent)) {
      removeChildFromParent({ parent, child: equation.id, state });
    }
  });

  // check for any new parents that should be informed about their new child
  currentParents.forEach((parent) => {
    if (!equation.dependencies.parents.includes(parent)) {
      addChildToParent({ parent, child: equation.id, state });
    }
  });

  // finally, we can update the equation dependencies with the current children
  equation.dependencies.parents = Array.from(currentParents);

  return equation;
}

export function updateParentValues({ equation, state }: { equation: Equation; state: DataState }) {
  if (!equation.rpn) return;

  equation.rpn.forEach((token) => {
    if (token.type === TokenType.Variable || token.type === TokenType.Cell) {
      token.value = state.equations[token.name].result;
    }
  });
}

export function removeChildFromParent({ parent, child, state }: { parent: string; child: string; state: DataState }) {
  const parentEquation = state.equations[parent];
  if (!parentEquation) return;

  // remove child from parent equation's dependencies
  const children = parentEquation.dependencies.children;
  const index = children.indexOf(child);
  if (index > -1) {
    children.splice(index, 1);
  }

  // check if parent equation has any input or children left -> if not it can be removed
  if (!parentEquation.input && parentEquation.dependencies.children.length === 0) {
    delete state.equations[parent];
  }
}

export function addChildToParent({ parent, child, state }: { parent: string; child: string; state: DataState }) {
  // check if parent equation already exists -> if not, add an empty equation with a single child
  const parentEquation = state.equations[parent];
  if (!parentEquation) {
    state.equations[parent] = { id: parent, dependencies: { parents: [], children: [child] } };
    return;
  }

  // for an existing equation, simply add the child to the dependencies
  const currentChildren = parentEquation.dependencies.children;
  if (!currentChildren.includes(child)) {
    currentChildren.push(child);
  }
}

export interface DependencyMap {
  [id: string]: string[];
}

export function collectDependentChildren({
  dependencyMap,
  equationId,
  state,
}: {
  dependencyMap: DependencyMap;
  equationId: string;
  state: DataState;
}): DependencyMap {
  /*
    This function collects all equations where at least one of the parents has changed.
    The keys are the affected equations, the value are the changed parents for that equation.
    To collect all affected equations, we call this function recursively, passing the dependency map through.
  */
  const equation = state.equations[equationId];
  if (!equation) return dependencyMap;

  // loop though the children and
  equation.dependencies.children.forEach((child) => {
    if (!dependencyMap[child]) {
      // this equation has not been captured before -> add it to dep. map and collect the dependencies for it's children
      dependencyMap[child] = [equationId];
      collectDependentChildren({ dependencyMap, equationId: child, state });
    } else if (!dependencyMap[child].includes(equationId)) {
      // this equation was already added by another parent -> simply add the next changed parent to the list
      dependencyMap[child].push(equationId);
    }
  });
  return dependencyMap;
}

export function removeEquationFromDependencyMap({
  dependencyMap,
  equationId,
}: {
  dependencyMap: DependencyMap;
  equationId: string;
}): string | undefined {
  /*
    Whenever an equation in the dependency map has no more unresolved parents, it is ready for evaluation.
    This function removes one such equation id from the dependency map and tries to find another equation
    with all it's dependencies resolved. If no such equation exists, the return value will be undefined.
    This will usually indicate a cyclic dependency or that all equations were successfully evaluated (empty map).
  */

  let equationReadyForEvaluation;

  // remove the entry itself
  if (dependencyMap[equationId]) {
    delete dependencyMap[equationId];
  }

  // remove the id from all other entries
  for (const key in dependencyMap) {
    const index = dependencyMap[key].indexOf(equationId);
    if (index > -1) {
      dependencyMap[key].splice(index, 1);
    }
    if (dependencyMap[key].length === 0) {
      equationReadyForEvaluation = key;
    }
  }

  return equationReadyForEvaluation;
}

export function markCyclicDependency({ dependencyMap, state }: { dependencyMap: DependencyMap; state: DataState }) {
  for (const key in dependencyMap) {
    const equation = state.equations[key];
    if (equation) {
      setEquationError({ equation, errorMessage: 'cyclic dependency' });
    }
  }
}

export function addSvgDependency({
  equationId,
  property,
  state,
}: {
  equationId: string;
  property: NumberProperty;
  state: DataState;
}) {
  const equation = state.equations[equationId];
  if (!equation) throw new Error(`Equation with id "${equationId}" does not exist`);

  if (equation.dependencies.svgUsage) {
    equation.dependencies.svgUsage.push(property);
  } else {
    equation.dependencies.svgUsage = [property];
  }
}
