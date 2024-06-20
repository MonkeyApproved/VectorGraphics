import { SvgSettings } from '../settings';
import { BaseEntity } from '../types';
import { getFreshStats } from '../utils';
import { UserAction, getInitialUserAction } from './userAction';

export interface SvgCanvasIds {
  bottomId: string;
  mainId: string;
  topId: string;
}

export interface Canvas<UserActionType = UserAction> extends BaseEntity {
  viewBox: string;
  elementIds: string[]; // can be elements or groups
  currentUserAction: UserActionType;
  localSettings?: SvgSettings;
}

export function getEmptyCanvas({ label }: { label?: string }): Omit<Canvas, 'id'> {
  return {
    stats: getFreshStats(),
    label,
    viewBox: '0 0 1000 1000',
    elementIds: [],
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
