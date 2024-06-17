import { Coordinate, Length } from "../../types";

export type PathSegmentTypes = 'move' | 'line' | 'quadraticCurve' | 'cubicCurve' | 'arc';

export interface BaseSegment {
  type: PathSegmentTypes;
  absolute: boolean;
  endPoint: Coordinate;
}

export interface LineSegment extends BaseSegment {
  type: 'line' | 'move';
}

export interface QuadraticCurveSegment extends BaseSegment {
  type: 'quadraticCurve';
  smooth: boolean;
  cp?: Coordinate;
}

export interface CubicCurveSegment extends BaseSegment {
  type: 'cubicCurve';
  smooth: boolean;
  cp1?: Coordinate;
  cp2: Coordinate;
}

export interface ArcSegment extends BaseSegment {
  type: 'arc';
  radiusX: Length;
  radiusY: Length;
  rotation: string | number;
  largeFlag: boolean;
  sweepFlag: boolean;
}

export type PathSegment = LineSegment | QuadraticCurveSegment | CubicCurveSegment | ArcSegment;

