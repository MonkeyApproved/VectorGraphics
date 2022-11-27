import type { RootState } from '../store';
import { BaseElement } from './svg/element';
import { ElementDict } from './svg/elementDict';

// Element Dictionary
export const selectElementDict = (state: RootState): ElementDict => state.data.svg.elementDict;
export const selectElementById =
  (id: string | undefined) =>
  (state: RootState): BaseElement | undefined => {
    if (id) return state.data.svg.elementDict[id];
    return undefined;
  };

// Element Selection
export const selectSelectedElementId = (state: RootState): string | undefined => state.data.svg.selectedElementId;
export const selectSelectedElement = (state: RootState): BaseElement | undefined => {
  const elementId = state.data.svg.selectedElementId;
  if (elementId) return state.data.svg.elementDict[elementId];
  return undefined;
};
