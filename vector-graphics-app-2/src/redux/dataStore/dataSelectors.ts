import type { RootState } from '../store';
import { Equation } from './equations/equation';
import { MouseStatus } from './handlers/mouseHandlers';
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

// Mouse Handlers
export const selectMouseEventStatus = (state: RootState): MouseStatus => state.data.mouseEvent.status;

// Equation Library
export const selectEquationById =
  (id: string) =>
  (state: RootState): Equation | undefined =>
    state.data.equations[id];
export const checkIfEquationIdExists =
  (id: string) =>
  (state: RootState): boolean => {
    if (!(id in state.data.equations)) return false; // no equation with this id
    if (state.data.equations[id].input === undefined) return false; // equation exists, but no input, meaning it is only placeholder for children dependencies
    return true;
  };
