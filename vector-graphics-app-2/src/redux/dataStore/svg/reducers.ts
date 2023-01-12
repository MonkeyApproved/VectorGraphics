import { DataSliceReducer } from '../dataSlice';
import { addSvgPropertyEquation } from '../equations/equation';
import { applyPosition, applySize, setPosition, setSize } from './coordinate';
import { BaseElement, BaseElementPixels, drawElement, getId, selectElementById } from './element';
import { addElementToDict, forEachElement, removeElementFromDict } from './elementDict';
import { applyStroke, Stroke, updateStroke } from './stroke';

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

const addBaseElementPixels: DataSliceReducer<{ element: BaseElementPixels }> = (state, { payload }) => {
  // create BaseElement (containing links to equations rather than the values) and add it to elementDict
  const elementId = getId(payload.element.type);
  const unit = 'pixel';
  const baseElement: BaseElement = {
    id: elementId,
    containerId: payload.element.containerId,
    type: payload.element.type,
    position: {
      x: addSvgPropertyEquation({
        property: { elementId, unit, type: 'position', dimension: 'x' },
        initialValue: payload.element.position.x,
        state,
      }),
      y: addSvgPropertyEquation({
        property: { elementId, unit, type: 'position', dimension: 'y' },
        initialValue: payload.element.position.y,
        state,
      }),
    },
    size: {
      x: addSvgPropertyEquation({
        property: { elementId, unit, type: 'size', dimension: 'x' },
        initialValue: payload.element.size.x,
        state,
      }),
      y: addSvgPropertyEquation({
        property: { elementId, unit, type: 'size', dimension: 'y' },
        initialValue: payload.element.size.y,
        state,
      }),
    },
    stroke: payload.element.stroke,
    fill: payload.element.fill,
    transformations: payload.element.transformations,
    enableDrag: true,
  };
  state.svg.elementDict[elementId] = baseElement;

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
    applyPosition({ element: state.svg.elementDict[payload.elementId], elementSelection, state });
  }
};

const updateElementSize: DataSliceReducer<{ elementId: string; x: string; y: string }> = (state, { payload }) => {
  if (state.svg.elementDict[payload.elementId]) {
    // update state
    const element = state.svg.elementDict[payload.elementId];
    setSize({ element, x: payload.x, y: payload.y, state });

    // update element position on canvas
    const elementSelection = selectElementById({ elementId: payload.elementId });
    applySize({ element: state.svg.elementDict[payload.elementId], elementSelection, state });
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
    applyStroke({ element: state.svg.elementDict[payload.elementId], elementSelection, state });
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
  addBaseElementPixels,
  updateElementPosition,
  updateElementSize,
  updateElementStroke,
  selectSingleElement,
  deleteElement,
};
