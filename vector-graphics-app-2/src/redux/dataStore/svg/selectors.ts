import type { RootState } from 'redux/store';
import { KeysMatchingType } from 'types';
import { BaseElement } from './element';

export const getElementDict = (state: RootState) => state.data.svg.elementDict;

export const getElementById = (id: string) => (state: RootState) => state.data.svg.elementDict[id];

export const getElementAttribute =
  <T>(id: string, attribute: KeysMatchingType<BaseElement, T>) =>
  (state: RootState) =>
    state.data.svg.elementDict[id][attribute];

export const getSelectedElementId = (state: RootState): string | undefined => state.data.svg.selectedElementId;

export const getSelectedElement = (state: RootState) => {
  const elementId = state.data.svg.selectedElementId;
  if (elementId) return state.data.svg.elementDict[elementId];
  return undefined;
};
