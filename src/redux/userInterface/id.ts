import { UiState } from './uiSlice';

export const TabIdSuffix = 'tab';
export function getTabId({ state }: { state: UiState }): string {
  state.tabCounter += 1;
  return `${TabIdSuffix}${state.tabCounter}`;
}
