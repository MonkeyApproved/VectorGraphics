import { DistributiveOmit } from 'react-redux';
import { BaseEntity, Coordinate } from '../types';
import { Circle, getCircleParams, getNewCircle } from './circle';
import { Ellipse, getEllipseParams, getNewEllipse } from './ellipse';
import { Line, getLineParams, getNewLine } from './line';
import { Path, getNewPath, getPathParams } from './path';
import { Polygon, getNewPolygon, getPolygonParams } from './polygon';
import { Polyline, getNewPolyline, getPolylineParams } from './polyline';
import { Rect, getNewRect, getRectParams } from './rect';

export type ShapeType = 'line' | 'rect' | 'circle' | 'ellipse' | 'path' | 'polygon' | 'polyline';

export interface BaseShape extends BaseEntity {
  type: ShapeType;
}

export type Shape = Line | Rect | Circle | Ellipse | Path | Polygon | Polyline;
export type NewShape = DistributiveOmit<Shape, 'id' | 'stats'>;
export type TempShareGeneric<T extends BaseShape> = Omit<T, 'id' | 'stats'>;
export type AnyShape = NewShape | Shape;
export type AnyShapeGeneric<T extends BaseShape> = T | Omit<T, 'id' | 'stats'>;

export type GetSvgParams<S extends BaseShape> = ({ shape }: { shape: AnyShapeGeneric<S> }) => {
  [attr: string]: number | string | undefined;
};

export function getSvgShapeParams({ shape }: { shape: AnyShape }) {
  if (shape.type === 'line') return getLineParams({ shape });
  if (shape.type === 'rect') return getRectParams({ shape });
  if (shape.type === 'circle') return getCircleParams({ shape });
  if (shape.type === 'ellipse') return getEllipseParams({ shape });
  if (shape.type === 'polygon') return getPolygonParams({ shape });
  if (shape.type === 'polyline') return getPolylineParams({ shape });
  if (shape.type === 'path') return getPathParams({ shape });
  throw new Error(`Unknown shape type: ${(shape as Shape).type}`);
}

export type GetNewShape<S> = ({ start, end }: { start: Coordinate; end: Coordinate }) => Omit<S, 'id' | 'stats'>;

export function getNewShape({
  shapeType,
  start,
  end,
}: {
  shapeType: ShapeType;
  start: Coordinate;
  end?: Coordinate;
}): NewShape {
  if (shapeType === 'line') return getNewLine({ start, end: end || start });
  if (shapeType === 'rect') return getNewRect({ start, end: end || start });
  if (shapeType === 'circle') return getNewCircle({ start, end: end || start });
  if (shapeType === 'ellipse') return getNewEllipse({ start, end: end || start });
  if (shapeType === 'polygon') return getNewPolygon({ start, end: end || start });
  if (shapeType === 'polyline') return getNewPolyline({ start, end: end || start });
  if (shapeType === 'path') return getNewPath({ start, end: end || start });
  throw new Error(`Unknown shape type: ${shapeType}`);
}
