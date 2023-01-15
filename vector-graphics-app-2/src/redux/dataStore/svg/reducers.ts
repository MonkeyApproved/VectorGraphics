import { DataSliceReducer } from '../dataSlice';
import { applyElementPosition, applyElementSize, setPosition, setSize } from './coordinate';
import { BaseElement, BaseElementPixels, drawElement, selectElementById } from './element';
import { addElementPixelsToDict, addElementToDict, forEachElement, removeElementFromDict } from './elementDict';
import { SvgTool } from './settings';
import { applyElementStroke, Stroke, updateStroke } from './stroke';

const setCanvasId: DataSliceReducer<{ canvasId: string }> = (state, { payload }) => {
  state.svg.canvasId = payload.canvasId;

  // if there are already element in our elementDict, we can draw them now
  forEachElement({
    dict: state.svg.elementDict,
    func: (element) => {
      if (selectElementById({ elementId: element.id }).empty()) {
        drawElement({ element, containerId: payload.canvasId, state });
      }
    },
  });
};

const setBottomCanvasId: DataSliceReducer<{ canvasId: string }> = (state, { payload }) => {
  state.svg.bottomCanvasId = payload.canvasId;
};

const setActiveTool: DataSliceReducer<{ tool: SvgTool }> = (state, { payload }) => {
  state.svg.settings.activeTool = payload.tool;
};

const addBaseElementPixels: DataSliceReducer<{ element: BaseElementPixels }> = (state, { payload }) => {
  // create BaseElement (containing links to equations rather than the values) and add it to elementDict
  const baseElement = addElementPixelsToDict({ state, element: payload.element });

  // if we already have a canvas, we can draw the element right away
  if (state.svg.canvasId) {
    drawElement({ element: baseElement, containerId: state.svg.canvasId, state });
  }
};

const addElement: DataSliceReducer<{ element: Omit<BaseElement, 'id'> }> = (state, { payload }) => {
  // when adding the element, the id will be set automatically
  const addedElement: BaseElement = addElementToDict({ dict: state.svg.elementDict, newElement: payload.element });

  // if we already have a canvas, we can draw the element right away
  if (state.svg.canvasId) {
    drawElement({ element: addedElement, containerId: state.svg.canvasId, state });
  }
};

const updateElementPosition: DataSliceReducer<{ elementId: string; x: string; y: string }> = (state, { payload }) => {
  if (state.svg.elementDict[payload.elementId]) {
    // update state
    const element = state.svg.elementDict[payload.elementId];
    setPosition({ element, x: payload.x, y: payload.y, state });

    // update element position on canvas
    const elementSelection = selectElementById({ elementId: payload.elementId });
    applyElementPosition({ element: state.svg.elementDict[payload.elementId], elementSelection, state });
  }
};

const updateElementSize: DataSliceReducer<{ elementId: string; x: string; y: string }> = (state, { payload }) => {
  if (state.svg.elementDict[payload.elementId]) {
    // update state
    const element = state.svg.elementDict[payload.elementId];
    setSize({ element, x: payload.x, y: payload.y, state });

    // update element position on canvas
    const elementSelection = selectElementById({ elementId: payload.elementId });
    applyElementSize({ element: state.svg.elementDict[payload.elementId], elementSelection, state });
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
    applyElementStroke({ element: state.svg.elementDict[payload.elementId], elementSelection, state });
  }
};

const selectSingleElement: DataSliceReducer<{ elementId: string }> = (state, { payload }) => {
  state.svg.selectedElementIds = [payload.elementId];
};

const deleteElement: DataSliceReducer<{ elementId: string }> = (state, { payload }) => {
  removeElementFromDict({ dict: state.svg.elementDict, elementId: payload.elementId });
  // TODO: remove element from canvas
};

export const svgReducers = {
  setCanvasId,
  setBottomCanvasId,
  setActiveTool,
  addElement,
  addBaseElementPixels,
  updateElementPosition,
  updateElementSize,
  updateElementStroke,
  selectSingleElement,
  deleteElement,
};
