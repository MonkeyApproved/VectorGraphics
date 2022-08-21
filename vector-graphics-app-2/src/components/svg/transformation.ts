export interface Rotation {
  type: 'rotate';
  angle: number;
  x: number;
  y: number;
}

export interface Translation {
  type: 'translate';
  x: number;
  y: number;
}

export interface Scale {
  type: 'scale';
  x: number;
  y: number;
}

export interface Skew {
  type: 'skew';
  direction: 'x' | 'y';
  factor: number;
}

export type Transformation = Rotation | Translation | Scale | Skew;
