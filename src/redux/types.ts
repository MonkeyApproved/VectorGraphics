import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// math slice
export type { Equation, Result } from './math/equationParsing';
export type StoreDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;

// canvas slice
export type {
  Shape,
  ShapeType,
  Line,
  Rect,
  Circle,
  Ellipse,
  Polygon,
  Polyline,
  NewShape,
  AnyShape,
} from './canvas/shape';
export type { Fill, Color, Stroke, Style } from './canvas/style';
export type { Transformation, Translation, Rotation, Scale, Skew } from './canvas/transformation';
export type { Element, ElementResolved } from './canvas/element';
export type { Canvas, SvgCanvasIds } from './canvas/canvas';
export type { SvgSettings } from './canvas/settings';
export type { UserAction, DrawAction, SelectAction } from './canvas/canvas/userAction';
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
