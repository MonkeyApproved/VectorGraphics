import { DataSliceReducer } from '../dataSlice';
import { applyPosition, applySize, Coordinate } from './coordinate';
import { BaseElement, drawElement, selectElementById } from './element';
import { addElementToDict, forEachElement, removeElementFromDict } from './elementDict';
import { applyStroke, Stroke, updateStroke } from './stroke';

const setCanvasId: DataSliceReducer<{ canvasId: string }> = (state, { payload }) => {
  state.svg.canvasId = payload.canvasId;

  // if there are already element in our elementDict, we can draw them now
  forEachElement({
    dict: state.svg.elementDict,
    func: (element) => {
      drawElement({ element, containerId: payload.canvasId });
    },
  });
};

const addElement: DataSliceReducer<{ element: Omit<BaseElement, 'id'> }> = (state, { payload }) => {
  // when adding the element, the id will be set automatically
  const addedElement: BaseElement = addElementToDict({ dict: state.svg.elementDict, newElement: payload.element });

  // if we already have a canvas, we can draw the element right away
  if (state.svg.canvasId) {
    drawElement({ element: addedElement, containerId: state.svg.canvasId });
  }
};

const updateElementPosition: DataSliceReducer<{ elementId: string; position: Coordinate }> = (state, { payload }) => {
  if (state.svg.elementDict[payload.elementId]) {
    // update state
    state.svg.elementDict[payload.elementId].position = payload.position;

    // update element position on canvas
    const elementSelection = selectElementById({ elementId: payload.elementId });
    applyPosition({ element: state.svg.elementDict[payload.elementId], elementSelection });
  }
};

const updateElementSize: DataSliceReducer<{ elementId: string; size: Coordinate }> = (state, { payload }) => {
  if (state.svg.elementDict[payload.elementId]) {
    // update state
    state.svg.elementDict[payload.elementId].size = payload.size;

    // update element position on canvas
    const elementSelection = selectElementById({ elementId: payload.elementId });
    applySize({ element: state.svg.elementDict[payload.elementId], elementSelection });
  }
};

const updateElementStroke: DataSliceReducer<{ elementId: string; updates: Partial<Stroke> }> = (state, { payload }) => {
  if (state.svg.elementDict[payload.elementId]) {
    // update state
    state.svg.elementDict[payload.elementId] = updateStroke({
      element: state.svg.elementDict[payload.elementId],
      updates: payload.updates,
    });

    // update element position on canvas
    const elementSelection = selectElementById({ elementId: payload.elementId });
    applyStroke({ element: state.svg.elementDict[payload.elementId], elementSelection });
  }
};

const selectSingleElement: DataSliceReducer<{ elementId: string }> = (state, { payload }) => {
  state.svg.selectedElementId = payload.elementId;
};

const deleteElement: DataSliceReducer<{ elementId: string }> = (state, { payload }) => {
  removeElementFromDict({ dict: state.svg.elementDict, elementId: payload.elementId });
  // TODO: remove element from canvas
};

export const svgReducers = {
  setCanvasId,
  addElement,
  updateElementPosition,
  updateElementSize,
  updateElementStroke,
  selectSingleElement,
  deleteElement,
};
