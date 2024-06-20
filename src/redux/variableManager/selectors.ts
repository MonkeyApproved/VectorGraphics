import { VariableManager } from './manager';
import { Equation, getExistingEquation, getEquation } from 'src/redux/math';
import { RootState } from 'src/redux/store';
import { getVariableManagerContext } from '.';
import {} from '../math/equationParsing/getEquation';

export const getVariableManager =
  ({ managerId }: { managerId: string }) =>
  (state: RootState): VariableManager =>
    state.variableManager.managers[managerId];

export const getVariableManagerEquation =
  ({ variableName }: { variableName: string }) =>
  (state: RootState): Equation => {
    const variableContext = getVariableManagerContext({ name: variableName });
    return getExistingEquation({ context: variableContext, state: state.math });
  };

export const doesVariableNameAlreadyExist =
  ({ variableName }: { variableName: string }) =>
  (state: RootState): boolean => {
    const variableContext = getVariableManagerContext({ name: variableName });
    const equation = getEquation({ context: variableContext, state: state.math });
    return equation !== undefined;
  };
