import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { applyPosition, applySize, Coordinate } from './svg/coordinate';

import { BaseElement, drawElement, selectElementById } from './svg/element';
import { addElementToDict, ElementDict, forEachElement, removeElementFromDict } from './svg/elementDict';
import { applyStroke, Stroke, updateStroke } from './svg/stroke';

export interface SvgState {
  elementDict: ElementDict;
  canvasId: string | undefined;
  selectedElementId: string | undefined;
}

const initialSvgState: SvgState = {
  elementDict: {},
  canvasId: undefined,
  selectedElementId: undefined,
};

export interface DataState {
  svg: SvgState;
  equations: string;
}

const initialState: DataState = {
  svg: initialSvgState,
  equations: 'TBD',
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setCanvasId: (state, { payload: { canvasId } }: PayloadAction<{ canvasId: string }>) => {
      state.svg.canvasId = canvasId;

      // if there are already element in our elementDict, we can draw them now
      forEachElement({
        dict: state.svg.elementDict,
        func: (element) => {
          drawElement({ element, containerId: canvasId });
        },
      });
    },
    addElement: (state, { payload: { element } }: PayloadAction<{ element: Omit<BaseElement, 'id'> }>) => {
      // when adding the element, the id will be set automatically
      const addedElement: BaseElement = addElementToDict({ dict: state.svg.elementDict, newElement: element });

      // if we already have a canvas, we can draw the element right away
      if (state.svg.canvasId) {
        drawElement({ element: addedElement, containerId: state.svg.canvasId });
      }
    },
    updateElementPosition: (
      state,
      { payload: { elementId, position } }: PayloadAction<{ elementId: string; position: Coordinate }>,
    ) => {
      if (state.svg.elementDict[elementId]) {
        // update state
        state.svg.elementDict[elementId].position = position;

        // update element position on canvas
        const elementSelection = selectElementById({ elementId });
        applyPosition({ element: state.svg.elementDict[elementId], elementSelection });
      }
    },
    updateElementSize: (
      state,
      { payload: { elementId, size } }: PayloadAction<{ elementId: string; size: Coordinate }>,
    ) => {
      if (state.svg.elementDict[elementId]) {
        // update state
        state.svg.elementDict[elementId].size = size;

        // update element size on canvas
        const elementSelection = selectElementById({ elementId });
        applySize({ element: state.svg.elementDict[elementId], elementSelection });
      }
    },
    updateElementStroke: (
      state,
      { payload: { elementId, updates } }: PayloadAction<{ elementId: string; updates: Partial<Stroke> }>,
    ) => {
      if (state.svg.elementDict[elementId]) {
        // update state
        state.svg.elementDict[elementId] = updateStroke({ element: state.svg.elementDict[elementId], updates });

        // update element stroke on canvas
        const elementSelection = selectElementById({ elementId });
        applyStroke({ element: state.svg.elementDict[elementId], elementSelection });
      }
    },
    deleteElement: (state, { payload: { elementId } }: PayloadAction<{ elementId: string }>) => {
      removeElementFromDict({ dict: state.svg.elementDict, elementId });

      // TODO: remove element from canvas
    },
    selectSingleElement: (state, { payload: { elementId } }: PayloadAction<{ elementId: string }>) => {
      state.svg.selectedElementId = elementId;
    },
  },
});

export default dataSlice;
export const {
  setCanvasId,
  addElement,
  updateElementPosition,
  updateElementSize,
  updateElementStroke,
  deleteElement,
  selectSingleElement,
} = dataSlice.actions;
