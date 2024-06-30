import { DistributiveOmit } from 'react-redux';
import { BaseEntity, Coordinate } from '../types';
import { Circle, getCircleArea, getCircleParams, getNewCircle } from './circle';
import { Ellipse, getEllipseArea, getEllipseParams, getNewEllipse } from './ellipse';
import { Line, getLineArea, getLineParams, getNewLine, updateLineFromNamespace } from './line';
import { Path, getNewPath, getPathArea, getPathParams } from './path';
import { Polygon, getNewPolygon, getPolygonArea, getPolygonParams } from './polygon';
import { Polyline, getNewPolyline, getPolylineArea, getPolylineParams } from './polyline';
import { Rect, getNewRect, getRectArea, getRectParams } from './rect';
import { Namespace } from 'src/redux/types';

export type ShapeType = 'line' | 'rect' | 'circle' | 'ellipse' | 'path' | 'polygon' | 'polyline';

export interface BaseShape extends BaseEntity {
  type: ShapeType;
  namespaceVersion?: number; // Variable namespace containing all equations for this shape
}

export type Shape = Line | Rect | Circle | Ellipse | Path | Polygon | Polyline;
export type NewShape = DistributiveOmit<Shape, 'id' | 'stats'>;
export type NewShapeGeneric<T extends BaseShape> = Omit<T, 'id' | 'stats'>;
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

export interface ShapeArea {
  elementId: string;
  shapeId: string;
  minX: number;
  centerX: number;
  maxX: number;
  minY: number;
  centerY: number;
  maxY: number;
}

export type RawShapeArea = Omit<ShapeArea, 'elementId' | 'shapeId'>;
export type GetShapeArea<S extends BaseShape> = ({ shape }: { shape: AnyShapeGeneric<S> }) => RawShapeArea;

export function getShapeArea({ shape }: { shape: AnyShape }): RawShapeArea {
  if (shape.type === 'line') return getLineArea({ shape });
  if (shape.type === 'rect') return getRectArea({ shape });
  if (shape.type === 'circle') return getCircleArea({ shape });
  if (shape.type === 'ellipse') return getEllipseArea({ shape });
  if (shape.type === 'polygon') return getPolygonArea({ shape });
  if (shape.type === 'polyline') return getPolylineArea({ shape });
  if (shape.type === 'path') return getPathArea({ shape });
  throw new Error(`Unknown shape type: ${(shape as Shape).type}`);
}

export type UpdateShapeFromNamespace<S extends BaseShape> = ({
  shape,
  namespace,
}: {
  shape: S;
  namespace: Namespace;
}) => S;

export function updateShapeFromNamespace({ shape, namespace }: { shape: Shape; namespace: Namespace }): Shape {
  if (shape.type === 'line') return updateLineFromNamespace({ shape, namespace });
  return shape;
}
