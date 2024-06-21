import { MouseEventTracker } from 'src/eventHandlers';
import { RootState } from 'src/redux/store';
import { DRAW_ACTION_TYPE, DrawAction, SELECT_ACTION_TYPE, UserAction } from '.';
import { Canvas } from '../canvas';
import { drawNewShape } from './drawNewShape';
import { IDLE_ACTION_TYPE, UIResponse } from './uiResponse';

export const getUIResponse =
  ({ mouseTracker, canvasId }: { mouseTracker: MouseEventTracker; canvasId: string }) =>
  (state: RootState): UIResponse => {
    const canvas = state.canvas.canvases[canvasId];
    if (!canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }

    // perform the currently selected user action and inform UI about the response
    if (canvas.currentUserAction.type === DRAW_ACTION_TYPE) {
      return drawNewShape({ canvas: canvas as Canvas<DrawAction>, mouseTracker });
    } else if (canvas.currentUserAction.type === SELECT_ACTION_TYPE) {
      return { type: IDLE_ACTION_TYPE, statusMessage: 'Start selecting element(s)' };
    }
    throw new Error(`Unknown action type ${(canvas.currentUserAction as UserAction).type}`);
  };
