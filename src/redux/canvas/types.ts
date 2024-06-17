export type RelativePosition2D =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type RelativePositionVertical = 'top' | 'center' | 'bottom';
export type RelativePositionHorizontal = 'left' | 'center' | 'right';

export type LengthUnit = 'absolute';
export type AngleUnit = 'deg' | 'rad' | '%';

export type Length = number;

export type LengthArray = number[];

export interface Angle {
  value: number;
  unit: AngleUnit;
}

export interface AngleArray {
  valueList: number[];
  unit: AngleUnit;
}

export type Percentage = number;

export type LineWidth = Length;

export interface Size {
  width: Length;
  height: Length;
}

export type XCoordinate = Length;
export type YCoordinate = Length;

export interface Coordinate {
  x: XCoordinate;
  y: YCoordinate;
}

export interface Area {
  position: Coordinate;
  positionAnchor: RelativePosition2D;
  size: Size;
}
