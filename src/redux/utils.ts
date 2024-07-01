// math slice
export {} from './math/context';
export { getEquation, getExistingEquation } from './math/equationParsing';

// canvas slice
export { getBottomCanvasId, getMainCanvasId, getSvgCanvasIds, getTopCanvasId } from './canvas/canvas';
export * from './canvas/coordinateMath';
export { getNewShape, getSvgShapeParams, moveShape } from './canvas/shape';
export { getNewRect } from './canvas/shape/rect';
export { initialCanvas } from './canvas/slice';
export { getSvgStyleAttribute, getSvgStyleParams } from './canvas/style';

// variableManager slice
export { initialVariableManager } from './variableManager/slice';

// spreadsheet slice

// dataExplorer slice

// userInterface slice
