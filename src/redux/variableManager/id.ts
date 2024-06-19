import { VariableManagerState } from './variableManagerSlice';

export const VariableManagerIdPrefix = 'variableManager';
export function getVariableManagerId({ state }: { state: VariableManagerState }): string {
  state.managerCounter += 1;
  return `${VariableManagerIdPrefix}${state.managerCounter}`;
}
