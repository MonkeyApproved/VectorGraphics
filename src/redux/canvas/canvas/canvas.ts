import { SvgSettings } from '../settings';
import { BaseEntity } from '../types';
import { getFreshStats } from '../utils';
import { UserAction, getInitialUserAction } from './userAction';
import { ViewBox } from './viewBox';

export interface SvgCanvasIds {
  bottomId: string;
  mainId: string;
  topId: string;
}

export interface Canvas<UserActionType = UserAction> extends BaseEntity {
  viewBox: ViewBox;
  elementIds: string[]; // can be elements or groups
  selectedElementIds: string[];
  currentUserAction: UserActionType;
  localSettings?: SvgSettings;
}

export function getEmptyCanvas({ label }: { label?: string }): Omit<Canvas, 'id'> {
  return {
    stats: getFreshStats(),
    label,
    viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
    elementIds: [],
    selectedElementIds: [],
    currentUserAction: getInitialUserAction(),
  };
}

export function getSvgCanvasIds({ canvasId }: { canvasId: string }): SvgCanvasIds {
  return {
    bottomId: getBottomCanvasId({ canvasId }),
    mainId: getMainCanvasId({ canvasId }),
    topId: getTopCanvasId({ canvasId }),
  };
}

export const getTopCanvasId = ({ canvasId }: { canvasId: string }) => `${canvasId}-top`;
export const getMainCanvasId = ({ canvasId }: { canvasId: string }) => `${canvasId}-main`;
export const getBottomCanvasId = ({ canvasId }: { canvasId: string }) => `${canvasId}-bottom`;
