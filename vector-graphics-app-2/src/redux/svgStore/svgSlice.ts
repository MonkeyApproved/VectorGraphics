import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseElementType, ElementDict } from '../../components/svg/element';
import { ElementHandlers } from '../../components/svg/handlers';
import type { RootState } from '../store';

export interface SvgState {
  elementDict: ElementDict;
  handlers: ElementHandlers;
}

const initialState: SvgState = {
  elementDict: {},
  handlers: {},
};

let elementCounter = 0;

const svgSlice = createSlice({
  name: 'svg',
  initialState,
  reducers: {
    addHandlers: (state, { payload: { handlers } }: PayloadAction<{ handlers: ElementHandlers }>) => {
      state.handlers = { ...state.handlers, ...handlers };
    },
    addElement: (state, { payload: { element } }: PayloadAction<{ element: BaseElementType }>) => {
      element.id = `${(elementCounter += 1)}`;
      element.handlers = state.handlers;
      state.elementDict[element.id] = element;
    },
    deleteElement: (state, { payload: { elementId } }: PayloadAction<{ elementId: string }>) => {
      delete state.elementDict[elementId];
    },
    selectSingleElement: (state, { payload: { elementId } }: PayloadAction<{ elementId: string }>) => {
      Object.values(state.elementDict).forEach(
        (element: BaseElementType) => (element.selected = element.id === elementId),
      );
    },
  },
});

export default svgSlice;

export const { addHandlers, addElement, deleteElement, selectSingleElement } = svgSlice.actions;
export const selectElements = (state: RootState): ElementDict => state.svg.elementDict;
export const selectSelectedElements = (state: RootState): BaseElementType[] => {
  return Object.values(state.svg.elementDict).filter((element) => element.selected);
};
