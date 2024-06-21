// math slice
export type { Equation, Result } from './math/equationParsing';

// canvas slice
export type { Shape, ShapeType, Line, Rect, Circle, Ellipse, Polygon, Polyline } from './canvas/shape';
export type { Fill, Color, Stroke } from './canvas/style';
export type { Transformation, Translation, Rotation, Scale, Skew } from './canvas/transformation';
export type { Canvas, SvgCanvasIds } from './canvas/canvas';
export type { UserAction, DrawAction, SelectAction } from './canvas/userActions/userAction';
export * from './canvas/types';

// variableManager slice
export type { VariableManager } from './variableManager/manager';
export type { VariableManagerContent } from './variableManager/content';

// spreadsheet slice
export type { Spreadsheet } from './spreadsheet/spreadsheet';

// dataExplorer slice
export type { DataExplorer } from './dataExplorer/explorer';

// userInterface slice
export * from './userInterface/types';
