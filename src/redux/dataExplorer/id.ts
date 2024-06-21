import { DataExplorerState } from './slice';

export const DataExplorerIdPrefix = 'variableManager';
export function getDataExplorerId({ state }: { state: DataExplorerState }): string {
  state.explorerCounter += 1;
  return `${DataExplorerIdPrefix}${state.explorerCounter}`;
}
