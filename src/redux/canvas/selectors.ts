import { RootState } from 'src/redux/store';
import { UserAction } from './canvas/userAction';
import { ElementDetails } from './element';
import { Style } from './style';

export const getCanvas =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState) =>
    state.canvas.canvases[canvasId];

export const getCanvasElementDetails =
  ({ elementId, canvasId }: { elementId: string; canvasId: string }) =>
  (state: RootState): ElementDetails => {
    // element components
    const element = state.canvas.elements[elementId];
    const shape = state.canvas.shapes[element.shapeId];
    const style = element.styleId ? state.canvas.styles[element.styleId] : undefined;
    const transformation = element.transformationId
      ? state.canvas.transformations[element.transformationId]
      : undefined;

    // check canvas state for this element
    const canvas = state.canvas.canvases[canvasId];
    const selected = canvas.selectedElementIds.includes(elementId);
    return { id: elementId, stats: element.stats, shape, style, transformation, selected };
  };

export const getCurrentUserAction =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): UserAction =>
    state.canvas.canvases[canvasId].currentUserAction;

export const getDefaultElementStyle =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): Style => {
    const canvas = state.canvas.canvases[canvasId];
    const localDefaultStyle = canvas.localSettings?.defaultElementStyle;
    const defaultStyle = localDefaultStyle || state.canvas.globalSettings.defaultElementStyle;
    return state.canvas.styles[defaultStyle];
  };

export const getSelectionRectStyle =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): Style => {
    const canvas = state.canvas.canvases[canvasId];
    const localStyle = canvas.localSettings?.selectionBoxStyle;
    return localStyle || state.canvas.globalSettings.selectionBoxStyle;
  };
