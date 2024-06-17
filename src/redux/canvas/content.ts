import { BaseContent } from 'src/redux/userInterface';

export const CANVAS_CONTENT_TYPE = 'canvas';

export interface CanvasContent extends BaseContent {
  type: typeof CANVAS_CONTENT_TYPE;
}
