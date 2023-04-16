import { DataSliceReducer } from '../dataSlice';
import { SvgProperty, updateSvgProperty } from '../equations/svgEquation';
import { applyElementStroke } from './applyAttributes';
import { BaseElement, drawElement, selectElementById } from './element';
import { addElementToDict, forEachElement, removeElementFromDict } from './elementDict';
import { addPathFromDefinition, drawPath } from './path';
import { SvgTool } from './settings';
import { Stroke, updateStroke } from './stroke';

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

const addElement: DataSliceReducer<{ element: Omit<BaseElement, 'id'> }> = (state, { payload }) => {
  // when adding the element, the id will be set automatically
  const addedElement: BaseElement = addElementToDict({ dict: state.svg.elementDict, newElement: payload.element });

  // if we already have a canvas, we can draw the element right away
  if (state.svg.canvasId) {
    drawElement({ element: addedElement, containerId: state.svg.canvasId, state });
  }
};

const addPath: DataSliceReducer<{ definition: string }> = (state, { payload }) => {
  const path = addPathFromDefinition({ definition: payload.definition, state });

  // if we already have a canvas, we can draw the element right away
  if (state.svg.canvasId) {
    drawPath({ path, containerId: state.svg.canvasId, state });
  }
};

const updateElementProperty: DataSliceReducer<{
  property: SvgProperty;
  value: string | number;
  lastValidNumber?: number;
}> = (state, { payload }) => {
  updateSvgProperty({ ...payload, state });
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
  removeElementFromDict({ dict: state.svg.elementDict, ...payload });
  // TODO: remove element from canvas
};

export const svgReducers = {
  setCanvasId,
  setBottomCanvasId,
  setActiveTool,
  addElement,
  addPath,
  updateElementProperty,
  updateElementStroke,
  selectSingleElement,
  deleteElement,
};
