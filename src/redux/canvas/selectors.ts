import { RootState } from 'src/redux/store';
import { UserAction } from './canvas/userAction';
import { Element, ElementDetails } from './element';
import { Style } from './style';
import { NewShapeGeneric, Rect, Shape, ShapeArea, getShapeArea } from './shape';
import { createSelector } from '@reduxjs/toolkit';
import { Transformation } from './transformation';
import { Canvas } from './canvas';

const getElementDict = (state: RootState): { [key: string]: Element } => state.canvas.elements;
const getShapeDict = (state: RootState): { [key: string]: Shape } => state.canvas.shapes;
const getStyleDict = (state: RootState): { [key: string]: Style } => state.canvas.styles;
const getTransformationDict = (state: RootState): { [key: string]: Transformation } => state.canvas.transformations;
const getCanvasDict = (state: RootState): { [key: string]: Canvas } => state.canvas.canvases;

export const getCanvas =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState) =>
    state.canvas.canvases[canvasId];

export const getCanvasElementDetails = createSelector(
  [
    getElementDict,
    getShapeDict,
    getStyleDict,
    getTransformationDict,
    getCanvasDict,
    (state: RootState, elementId: string): string => elementId,
    (state: RootState, elementId: string, canvasId: string): string => canvasId,
  ],
  (elementDict, shapeDict, styleDict, transformationDict, canvasDict, elementId, canvasId): ElementDetails => {
    // element components
    const element = elementDict[elementId];
    const shape = shapeDict[element.shapeId];
    const style = element.styleId ? styleDict[element.styleId] : undefined;
    const transformation = element.transformationId ? transformationDict[element.transformationId] : undefined;

    // check canvas state for this element
    const canvas = canvasDict[canvasId];
    const selected = canvas.selectedElementIds.includes(elementId);
    return { id: elementId, stats: element.stats, shape, style, transformation, selected };
  },
);

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

export const getHighlightedElementStyle =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): Style => {
    const canvas = state.canvas.canvases[canvasId];
    const localStyle = canvas.localSettings?.highlightedElementStyle;
    return localStyle || state.canvas.globalSettings.highlightedElementStyle;
  };

export const getSelectedElementIds =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): string[] =>
    state.canvas.canvases[canvasId].selectedElementIds;

export const getAllElementAreas =
  ({ canvasId }: { canvasId: string }) =>
  (state: RootState): ShapeArea[] => {
    const canvas = state.canvas.canvases[canvasId];
    return canvas.elementIds.map((elementId) => {
      const shapeId = state.canvas.elements[elementId].shapeId;
      const shape = state.canvas.shapes[shapeId];
      const rawArea = getShapeArea({ shape });
      return {
        elementId,
        shapeId,
        ...rawArea,
      };
    });
  };

export const getMinimalRectContainingElements =
  ({ elementIds }: { elementIds: string[] }) =>
  (state: RootState): NewShapeGeneric<Rect> | undefined => {
    if (elementIds.length === 0) {
      return undefined;
    }
    const elementAreas = elementIds.map((elementId) => {
      const element = state.canvas.elements[elementId];
      const shape = state.canvas.shapes[element.shapeId];
      return getShapeArea({ shape });
    });
    const minX = Math.min(...elementAreas.map((area) => area.minX));
    const maxX = Math.max(...elementAreas.map((area) => area.maxX));
    const minY = Math.min(...elementAreas.map((area) => area.minY));
    const maxY = Math.max(...elementAreas.map((area) => area.maxY));
    return {
      type: 'rect',
      position: { x: minX, y: minY },
      size: { width: maxX - minX, height: maxY - minY },
      positionAnchor: 'top-left',
    };
  };
