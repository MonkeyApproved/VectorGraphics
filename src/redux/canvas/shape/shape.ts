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
export type TempShape = DistributiveOmit<Shape, 'id' | 'stats'>;
export type AnyShape = TempShape | Shape;
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
  end: Coordinate;
}): TempShape {
  if (shapeType === 'line') return getNewLine({ start, end });
  if (shapeType === 'rect') return getNewRect({ start, end });
  if (shapeType === 'circle') return getNewCircle({ start, end });
  if (shapeType === 'ellipse') return getNewEllipse({ start, end });
  if (shapeType === 'polygon') return getNewPolygon({ start, end });
  if (shapeType === 'polyline') return getNewPolyline({ start, end });
  if (shapeType === 'path') return getNewPath({ start, end });
  throw new Error(`Unknown shape type: ${shapeType}`);
}
