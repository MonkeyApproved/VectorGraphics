import { Circle, getCircleParams } from './circle';
import { Ellipse, getEllipseParams } from './ellipse';
import { Line, getLineParams } from './line';
import { Path, getPathParams } from './path';
import { Polygon, getPolygonParams } from './polygon';
import { Polyline, getPolylineParams } from './polyline';
import { Rect, getRectParams } from './rect';

export interface BaseShape {
  id: string;
  label: string;
  type: string;
}

export interface UnknownShape extends BaseShape {
  type: 'unknown';
}

export type Shape = UnknownShape | Line | Rect | Circle | Ellipse | Path | Polygon | Polyline;

export type GetSvgParams<S> = ({ shape }: { shape: S }) => { [attr: string]: number | string | undefined };

export const getSvgParams: GetSvgParams<Shape> = ({ shape }) => {
  if (shape.type === 'line') return getLineParams({ shape });
  if (shape.type === 'rect') return getRectParams({ shape });
  if (shape.type === 'circle') return getCircleParams({ shape });
  if (shape.type === 'ellipse') return getEllipseParams({ shape });
  if (shape.type === 'polygon') return getPolygonParams({ shape });
  if (shape.type === 'polyline') return getPolylineParams({ shape });
  if (shape.type === 'path') return getPathParams({ shape });
  throw new Error(`Unknown shape type for ${shape.id}`);
};
