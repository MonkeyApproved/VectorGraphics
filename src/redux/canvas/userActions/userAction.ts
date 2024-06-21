import { ShapeType } from '../shape';

export interface BaseUserAction {
  type: string;
}

export const DRAW_ACTION_TYPE = 'drawShape';
export interface DrawAction extends BaseUserAction {
  type: typeof DRAW_ACTION_TYPE;
  shapeType: ShapeType;
}

export const SELECT_ACTION_TYPE = 'select';
export interface SelectAction extends BaseUserAction {
  type: typeof SELECT_ACTION_TYPE;
}

export type UserAction = DrawAction | SelectAction;

export const getInitialUserAction = (): UserAction => ({
  type: 'select',
});
