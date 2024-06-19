import { RootState } from 'src/redux/store';
import { Canvas } from './canvas';

export const getCanvas =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): Canvas =>
    state.canvas.canvases[canvasId];
