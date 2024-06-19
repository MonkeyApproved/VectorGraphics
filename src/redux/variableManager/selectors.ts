import { VariableManager } from './manager';
import { Equation, getExistingEquation } from 'src/redux/math';
import { RootState } from 'src/redux/store';
import { getVariableContext } from '.';

export const getVariableManager =
  ({ managerId }: { managerId: string }) =>
  (state: RootState): VariableManager =>
    state.variableManager.managers[managerId];

export const getVariableManagerEquation =
  ({ variableName }: { variableName: string }) =>
  (state: RootState): Equation => {
    const variableContext = getVariableContext({ name: variableName });
    return getExistingEquation({ context: variableContext, state: state.math });
  };
