import { CanvasSliceReducer } from './canvasSlice';
import { IdType, getElementId, getId, getShapeId, getStyleId } from './id';
import { applyStyle } from './reducers.helper';
import { Shape } from './shape';
import { Style } from './style';
import { getFreshStats } from './utils';

type NewShape = Omit<Shape, 'id' | 'stats'>;
type NewStyle = Omit<Style, 'id' | 'stats'>;
type ExistingShape = Omit<Shape, 'stats'>;
type ExistingStyle = Omit<Style, 'stats'>;

const getNewId: CanvasSliceReducer<{ type: IdType }> = (state, { payload }) => getId({ type: payload.type, state });

const addElement: CanvasSliceReducer<{ shape: NewShape }> = (state, { payload }) => {
  const shapeId = getShapeId({ type: payload.shape.type, state });
  state.shapes[shapeId] = { ...payload.shape, id: shapeId, stats: getFreshStats() } as Shape;

  const elementId = getElementId({ state });
  state.elements[elementId] = { id: elementId, stats: getFreshStats(), shapeId };
};

const duplicateElement: CanvasSliceReducer<{ elementId: string }> = (state, { payload }) => {
  const element = state.elements[payload.elementId];
  if (!element) {
    throw new Error(`Element with id ${payload.elementId} not found`);
  }
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
  getNewId,
  // element/shape reduces
  addElement,
  duplicateElement,
  removeElement,
  updateShape,
  // style reducers
  applyNewStyle,
  applyExistingStyle,
  updateStyle,
};
