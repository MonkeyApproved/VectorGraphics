// main store
export * from './hooks';
export * from './store';

// variableManager slice
export * from './variableManager/variableManagerSlice';
export * from './variableManager/selectors';
export { getVariableManagerContext } from './variableManager';

// math slice
export * from './math/mathSlice';
export * from './math/selectors';
export type { Equation } from './math';

// canvas slice
export * from './canvas/canvasSlice';
export * from './canvas/selectors';
export * from './canvas/coordinateMath';
export type { Canvas, UserAction, Shape, ShapeType, SvgCanvasIds, Coordinate } from './canvas';
export { getSvgCanvasIds, getSvgParams } from './canvas';

// userInterface slice
export * from './userInterface/uiSlice';
export * from './userInterface/selectors';

// spreadsheet slice
export * from './spreadsheet/spreadsheetSlice';
export * from './spreadsheet/selectors';
