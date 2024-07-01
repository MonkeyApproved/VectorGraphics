import { UiState } from './slice';

export const TabIdPrefix = 'tab';
export function getTabId({ state }: { state: UiState }): string {
  state.tabCounter += 1;
  return `${TabIdPrefix}${state.tabCounter}`;
}
