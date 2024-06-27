import { CanvasSliceReducer } from './slice';
import { getCanvasId, getElementId, getShapeId, getStyleId } from './id';
import { applyStyle, getExistingCanvasElement } from './reducers.helper';
import { Shape, NewShape } from './shape';
import { Style } from './style';
import { getEmptyCanvas } from './canvas';
import { getFreshStats } from './utils';
import { UserAction } from './canvas/userAction';
import { Element } from './element';

type NewStyle = Omit<Style, 'id' | 'stats'>;
type ExistingShape = Omit<Shape, 'stats'>;
type ExistingStyle = Omit<Style, 'stats'>;

const addCanvas: CanvasSliceReducer<{ label?: string }> = (state, { payload }) => {
  const canvasId = getCanvasId({ state });
  state.canvases[canvasId] = { ...getEmptyCanvas({ label: payload.label }), id: canvasId };
};

const removeCanvas: CanvasSliceReducer<{ canvasId: string }> = (state, { payload }) => {
  // get the canvas to remove
  const canvas = state.canvases[payload.canvasId];
  if (!canvas) {
    throw new Error(`Canvas with id ${payload.canvasId} not found`);
  }

  // update usage of all elements in the canvas
  for (const elementId of canvas.elementIds) {
    const element = getExistingCanvasElement({ id: elementId, state });
    element.stats.usages--;
  }

  // remove the canvas
  delete state.canvases[payload.canvasId];
};

const setUserAction: CanvasSliceReducer<{ canvasId: string; userAction: UserAction }> = (state, { payload }) => {
  const canvas = state.canvases[payload.canvasId];
  if (!canvas) {
    throw new Error(`Canvas with id ${payload.canvasId} not found`);
  }
  canvas.currentUserAction = payload.userAction;
};

const addElementToCanvas: CanvasSliceReducer<{ canvasId: string; shape: NewShape }> = (state, { payload }) => {
  // get the canvas to add the element to
  const canvas = state.canvases[payload.canvasId];
  if (!canvas) {
    throw new Error(`Canvas with id ${payload.canvasId} not found`);
  }

  // add shape to store
  const shapeId = getShapeId({ type: payload.shape.type, state });
  const shape: Shape = { ...payload.shape, id: shapeId, stats: getFreshStats() };
  state.shapes[shapeId] = shape;

  // add element to store, referencing the new shape
  const elementId = getElementId({ state });
  const element: Element = { id: elementId, stats: getFreshStats(), shapeId };
  state.elements[elementId] = element;

  // add the element to the canvas
  canvas.elementIds.push(elementId);
  element.stats.usages++;
};

const setSelectedElements: CanvasSliceReducer<{ canvasId: string; elements: string[] }> = (state, { payload }) => {
  const canvas = state.canvases[payload.canvasId];
  if (!canvas) {
    throw new Error(`Canvas with id ${payload.canvasId} not found`);
  }
  canvas.selectedElementIds = payload.elements;
};

const duplicateElement: CanvasSliceReducer<{ elementId: string }> = (state, { payload }) => {
  // get the element to duplicate
  const element = state.elements[payload.elementId];
  if (!element) {
    throw new Error(`Element with id ${payload.elementId} not found`);
  }

  // generate a new element with the same shape shape, style and transformations as the original
  const newElementId = getElementId({ state });
  state.elements[newElementId] = { ...element, id: newElementId, stats: getFreshStats() };
};

const applyExistingStyle: CanvasSliceReducer<{ targetId: string; styleId: string }> = (state, { payload }) => {
  applyStyle({ ...payload, state });
};

const applyNewStyle: CanvasSliceReducer<{ targetId: string; style: NewStyle }> = (state, { payload }) => {
  // add new style to store
  const styleId = getStyleId({ state });
  state.styles[styleId] = { ...payload.style, id: styleId, stats: getFreshStats() };

  // apply style to target
  applyStyle({ targetId: payload.targetId, styleId, state });
};

const updateShape: CanvasSliceReducer<{ shape: Partial<ExistingShape> }> = (state, { payload }) => {
  // make sure the shape id is provided
  if (!payload.shape.id) throw new Error('Shape id is required for update');

  // find the shape to update
  const shape: Shape = state.shapes[payload.shape.id];
  if (!shape) throw new Error(`Shape with id ${payload.shape.id} not found`);

  // apply the changes, by merging the payload with the existing shape attributes
  shape.stats.version++;
  state.shapes[payload.shape.id] = { ...shape, ...payload.shape } as Shape;
};

const updateStyle: CanvasSliceReducer<{ style: Partial<ExistingStyle> }> = (state, { payload }) => {
  // make sure the style id is provided
  if (!payload.style.id) throw new Error('Style id is required for update');

  // find the style to update
  const style: Style = state.styles[payload.style.id];
  if (!style) throw new Error(`Style with id ${payload.style.id} not found`);

  // apply the changes, by merging the payload with the existing style attributes
  style.stats.version++;
  state.styles[payload.style.id] = { ...style, ...payload.style } as Style;
};

const removeElement: CanvasSliceReducer<{ elementId: string }> = (state, { payload }) => {
  const element = state.elements[payload.elementId];
  if (!element) {
    throw new Error(`Element with id ${payload.elementId} not found`);
  }
  delete state.elements[payload.elementId];
};

export const reducers = {
  // selection reducers
  setSelectedElements,
  // canvas reducers
  addCanvas,
  removeCanvas,
  setUserAction,
  addElementToCanvas,
  // element/shape reducers
  duplicateElement,
  removeElement,
  updateShape,
  // style reducers
  applyNewStyle,
  applyExistingStyle,
  updateStyle,
};
