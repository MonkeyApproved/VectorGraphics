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
  mode: 'click' | 'rectAll' | 'rectCenter';
}

export const SETTINGS_ACTION_TYPE = 'settings';
export interface SettingsAction extends BaseUserAction {
  type: typeof SETTINGS_ACTION_TYPE;
}

export type MainUserActionTypes = typeof DRAW_ACTION_TYPE | typeof SELECT_ACTION_TYPE | typeof SETTINGS_ACTION_TYPE;
export type UserAction = DrawAction | SelectAction | SettingsAction;

export const getInitialUserAction = (): UserAction => ({
  type: 'select',
  mode: 'rectAll',
});
