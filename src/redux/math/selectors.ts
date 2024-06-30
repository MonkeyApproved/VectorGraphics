import { RootState } from '../store';
import { Equation } from './equationParsing';
import { Context } from './context';
import { Namespace } from '../types';
import { createSelector } from '@reduxjs/toolkit';

const getNamespaceDict = (state: RootState) => state.math.variables;
const inputContextNamespace = (state: RootState, context: Context) => context.namespace;
const inputNamespace = (state: RootState, namespace: string) => namespace;
const inputContextName = (state: RootState, context: Context) => context.name;

export const getEquationOrUndefined = createSelector(
  [getNamespaceDict, inputContextNamespace, inputContextName],
  (namespaceDict, contextNamespace, contextName): Equation | undefined => {
    const namespace = namespaceDict[contextNamespace];
    if (!namespace) {
      return undefined;
    }
    return namespace.equations[contextName];
  },
);

export const getExistingEquation = createSelector(
  [getNamespaceDict, inputContextNamespace, inputContextName],
  (namespaceDict, contextNamespace, contextName): Equation => {
    const namespace = namespaceDict[contextNamespace];
    if (!namespace) {
      throw new Error(`Namespace with id ${contextNamespace} does not exist`);
    }
    const equation = namespace.equations[contextName];
    if (!equation) {
      throw new Error(`Equation with id ${contextName} does not exist in namespace ${contextNamespace}`);
    }
    return equation;
  },
);

export const getNamespaceOrUndefined = createSelector(
  [getNamespaceDict, inputNamespace],
  (namespaceDict, contextNamespace): Namespace | undefined => namespaceDict[contextNamespace],
);
