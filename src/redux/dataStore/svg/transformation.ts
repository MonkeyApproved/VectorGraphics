export interface BaseTransformation {
  type: string;
  x: number;
  y: number;
}

export interface Rotation extends BaseTransformation {
  type: 'rotate';
  angle: number;
}

export interface Translation extends BaseTransformation {
  type: 'translate';
}

export interface Scale extends BaseTransformation {
  type: 'scale';
}

export interface Skew extends BaseTransformation {
  type: 'skew';
}

export type Transformation = Rotation | Translation | Scale | Skew;
