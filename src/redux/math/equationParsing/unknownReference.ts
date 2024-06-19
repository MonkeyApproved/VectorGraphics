import { BaseContext, Context, Dependencies } from '..';
import { MathState } from '../mathSlice';
import { deleteContext } from './contextUtils';
import { getEquation } from './getEquation';

export const MAIN_UNKNOWN_NAMESPACE = 'variables';
export const UNKNOWN_CONTEXT_TYPE = 'unknown';

export interface UnknownReferencesDict {
  [referenceId: string]: Context[];
}

export interface UndefinedContext extends BaseContext {
  type: typeof UNKNOWN_CONTEXT_TYPE;
}

function getUnknownContext({ name, namespace }: { name: string; namespace: string }): UndefinedContext {
  return {
    type: UNKNOWN_CONTEXT_TYPE,
    namespace,
    name,
  };
}

export function addUnknownReference({
  child,
  reference,
  state,
}: {
  reference: string;
  child: Context;
  state: MathState;
}): Context {
  const unknownContext = getUnknownContext({ name: reference, namespace: MAIN_UNKNOWN_NAMESPACE });
  const namespace = state.unknownReferences[MAIN_UNKNOWN_NAMESPACE];
  const existingReference = namespace[reference];

  if (!existingReference) {
    // this reference is not yet in the unknown references
    namespace[reference] = [child];
  } else {
    const match = existingReference.find(
      (context) => context.name === child.name && context.namespace === child.namespace,
    );
    if (match === undefined) {
      // the existing reference does not contain the child context yet: add it
      namespace[reference].push(child);
    }
  }

  return unknownContext;
}

export function removeChildFromUnknownReference({
  child,
  reference,
  state,
}: {
  child: Context;
  reference: Context;
  state: MathState;
}) {
  const namespace = state.unknownReferences[reference.namespace];
  if (!namespace) {
    throw new Error(`Cannot remove child from unknown reference: namespace ${reference.namespace} does not exist`);
  }
  const existingReference = namespace[reference.name];
  if (!existingReference) {
    throw new Error(`Cannot remove child from unknown reference: reference name ${reference.name} does not exist`);
  }
  deleteContext({ context: child, contextList: existingReference });

  // check if the unknown reference is empty now, meaning we can delete it
  if (existingReference.length === 0) {
    delete namespace[reference.name];
  }
}

export function retrieveExistingDependencies({ context, state }: { context: Context; state: MathState }): Dependencies {
  // currently, we only expect variables which are all stored in the main unknown namespace
  // if we later also add spreadsheets, we need to update this logic and include additional namespaces
  const namespace = state.unknownReferences[MAIN_UNKNOWN_NAMESPACE];
  const existingReference = namespace[context.name];

  if (!existingReference) {
    return { children: [], parents: [] };
  }

  // context has known children: delete the unknown reference and mark the children as dependencies
  const dependencies: Dependencies = { children: namespace[context.name], parents: [] };
  delete namespace[context.name];

  // we have to inform the children about the updated context, as they still reference the unknown reference
  const unknownContext = getUnknownContext({ name: context.name, namespace: MAIN_UNKNOWN_NAMESPACE });
  for (const child of dependencies.children) {
    const childEquation = getEquation({ context: child, state });
    if (!childEquation) {
      // this should not happen, as only known equations should be listed as children
      throw new Error(`Unknown error: Equation with id ${child.name} does not exist`);
    }
    // delete old unknown context and add new updated context
    deleteContext({ context: unknownContext, contextList: childEquation.dependencies.parents });
    childEquation.dependencies.parents.push(context);
  }
  return dependencies;
}
