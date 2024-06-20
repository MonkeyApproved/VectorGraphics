import { ShapeType } from '../shape';

export interface BaseUserAction {
  type: string;
}

export interface DrawAction extends BaseUserAction {
  type: 'draw';
  shapeType: ShapeType;
}

export interface SelectAction extends BaseUserAction {
  type: 'select';
}

export type UserAction = DrawAction | SelectAction;
