import { RootState } from 'redux/store';
import { KeysMatchingType } from 'types';
import { BaseElement } from './element';
import { SvgProperty, svgPropertyValue } from './context';

export const getElementDict = (state: RootState) => state.data.svg.elementDict;

export const getElementById = (id: string) => (state: RootState) => state.data.svg.elementDict[id];

export const getActiveTool = (state: RootState) => state.data.svg.settings.activeTool;

export const getElementAttribute =
  <T>(id: string, attribute: KeysMatchingType<BaseElement, T>) =>
  (state: RootState) =>
    state.data.svg.elementDict[id][attribute];

export const getSvgPropertyValue = (property: SvgProperty) => (state: RootState) =>
  svgPropertyValue({ property, state: state.data });

export const getSelectedElementIds = (state: RootState): string[] => state.data.svg.selectedElementIds;

export const getSelectedElements = (state: RootState) => {
  const ids = state.data.svg.selectedElementIds;
  return ids.map((id) => state.data.svg.elementDict[id]);
};
