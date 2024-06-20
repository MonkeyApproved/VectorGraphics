import { RootState } from 'src/redux/store';
import { Canvas, DrawAction } from './canvas';
import { MouseEventTracker } from 'src/mouseHandlers';
import drawNewShape from './draw/drawNewShape';

export const getCanvas =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): Canvas =>
    state.canvas.canvases[canvasId];

export const updateCanvasOnMouseAction =
  ({ mouseTracker, canvasId }: { mouseTracker: MouseEventTracker; canvasId: string }) =>
  (state: RootState): string => {
    const canvas = state.canvas.canvases[canvasId];
    if (!canvas) {
      throw new Error(`Canvas with id ${canvasId} not found`);
    }

    if (canvas.currentUserAction.type !== 'drawShape') {
      return 'select nothing';
    }
    return drawNewShape({ canvas: canvas as Canvas<DrawAction>, mouseTracker });
  };
