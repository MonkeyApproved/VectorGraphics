import { BaseEntity, ElementSelection } from '../types';
import { Circle, getCircleParams } from './circle';
import { Ellipse, getEllipseParams } from './ellipse';
import { Line, getLineParams } from './line';
import { Path, getPathParams } from './path';
import { Polygon, getPolygonParams } from './polygon';
import { Polyline, getPolylineParams } from './polyline';
import { Rect, getRectParams } from './rect';

export type ShapeType = 'line' | 'rect' | 'circle' | 'ellipse' | 'path' | 'polygon' | 'polyline';

export interface BaseShape extends BaseEntity {
  type: ShapeType;
}

export type Shape = Line | Rect | Circle | Ellipse | Path | Polygon | Polyline;

export type GetSvgParams<S> = ({ shape }: { shape: S }) => { [attr: string]: number | string | undefined };

export function setShapeAttributes({ shape, selection }: { shape: Shape; selection: ElementSelection }) {
  const params = getSvgParams({ shape });
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      selection.attr(key, value);
    }
  }
}

export const getSvgParams: GetSvgParams<Shape> = ({ shape }) => {
  if (shape.type === 'line') return getLineParams({ shape });
  if (shape.type === 'rect') return getRectParams({ shape });
  if (shape.type === 'circle') return getCircleParams({ shape });
  if (shape.type === 'ellipse') return getEllipseParams({ shape });
  if (shape.type === 'polygon') return getPolygonParams({ shape });
  if (shape.type === 'polyline') return getPolylineParams({ shape });
  if (shape.type === 'path') return getPathParams({ shape });
  throw new Error(`Unknown shape type: ${(shape as Shape).type}`);
};
