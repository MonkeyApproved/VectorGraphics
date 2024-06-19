import { BaseContent, GetAvailableContent, GetContent } from 'src/redux/userInterface';
import { CanvasState } from './canvasSlice';

export const CANVAS_CONTENT_TYPE = 'canvas';

export interface CanvasContent extends BaseContent {
  type: typeof CANVAS_CONTENT_TYPE;
}

export const getCanvasContent: GetContent<CanvasState> = ({ contentId, state }) => {
  const canvas = state.canvases[contentId];
  return {
    type: CANVAS_CONTENT_TYPE,
    contentId: canvas.id,
    label: canvas.label,
  };
};

export const getAvailableCanvases: GetAvailableContent<CanvasState> = ({ state }) => {
  return Object.keys(state.canvases).map((canvasId) => {
    return getCanvasContent({ contentId: canvasId, state });
  });
};
