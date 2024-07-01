import { VariableManager } from './manager';
import { Equation } from 'src/redux/types';
import { RootState } from 'src/redux/store';
import { VARIABLE_NAMESPACE } from './context';
import { createSelector } from '@reduxjs/toolkit';

const getManagerDict = (state: RootState) => state.variableManager.managers;
const getNamespaceDict = (state: RootState) => state.math.variables;
const inputVariableName = (state: RootState, variableName: string) => variableName;
const inputManagerId = (state: RootState, managerId: string) => managerId;

export const getVariableManager = createSelector(
  [getManagerDict, inputManagerId],
  (managerDict, managerId): VariableManager => managerDict[managerId],
);

export const getVariableManagerEquation = createSelector(
  [getNamespaceDict, inputVariableName],
  (namespaceDict, variableName): Equation => {
    const namespace = namespaceDict[VARIABLE_NAMESPACE];
    const equation = namespace.equations[variableName];
    if (!equation) {
      throw new Error(`Equation with id ${variableName} does not exist in variable namespace`);
    }
    return equation;
  },
);

export const doesVariableNameAlreadyExist = createSelector(
  [getNamespaceDict, inputVariableName],
  (namespaceDict, variableName): boolean => {
    const namespace = namespaceDict[VARIABLE_NAMESPACE];
    const equation = namespace.equations[variableName];
    return equation === undefined;
  },
);
