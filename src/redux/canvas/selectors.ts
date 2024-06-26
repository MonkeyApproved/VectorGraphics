import { RootState } from 'src/redux/store';
import { UserAction } from './canvas/userAction';
import { SvgSettings } from './settings';
import { ElementResolved } from './element';

export const getCanvas =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState) =>
    state.canvas.canvases[canvasId];

export const getCanvasElements =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): ElementResolved[] => {
    const elementIds = state.canvas.canvases[canvasId].elementIds;
    return elementIds.map((id) => {
      const element = state.canvas.elements[id];
      const shape = state.canvas.shapes[element.shapeId];
      const style = element.styleId ? state.canvas.styles[element.styleId] : undefined;
      const transformation = element.transformationId
        ? state.canvas.transformations[element.transformationId]
        : undefined;
      return { id, stats: element.stats, shape, style, transformation };
    });
  };

export const getCurrentUserAction =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): UserAction =>
    state.canvas.canvases[canvasId].currentUserAction;

export const getCanvasSettings =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): SvgSettings => {
    const localSettings = state.canvas.canvases[canvasId].localSettings;
    const globalSettings = state.canvas.globalSettings;
    return localSettings || globalSettings;
  };
