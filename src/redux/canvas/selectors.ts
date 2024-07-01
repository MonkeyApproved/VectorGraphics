import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { Canvas } from './canvas';
import { UserAction } from './canvas/userAction';
import { ViewBox, viewBoxString } from './canvas/viewBox';
import { Element, ElementDetails } from './element';
import { SvgSettings } from './settings';
import { AnyShape, NewShapeGeneric, Rect, Shape, ShapeArea, getShapeArea } from './shape';
import { Style } from './style';
import { Transformation } from './transformation';

const getElementDict = (state: RootState): { [key: string]: Element } => state.canvas.elements;
const getShapeDict = (state: RootState): { [key: string]: Shape } => state.canvas.shapes;
const getStyleDict = (state: RootState): { [key: string]: Style } => state.canvas.styles;
const getTransformationDict = (state: RootState): { [key: string]: Transformation } => state.canvas.transformations;
const getCanvasDict = (state: RootState): { [key: string]: Canvas } => state.canvas.canvases;
const getGlobalSettings = (state: RootState): SvgSettings => state.canvas.globalSettings;
const inputCanvasId = (state: RootState, canvasId: string): string => canvasId;

export const getCanvas = createSelector(
  [getCanvasDict, inputCanvasId],
  (canvasDict, canvasId): Canvas => canvasDict[canvasId],
);

export const getCanvasViewBox = createSelector(
  [getCanvasDict, inputCanvasId],
  (canvasDict, canvasId): ViewBox => canvasDict[canvasId].viewBox,
);

export const getCanvasViewBoxString = createSelector([getCanvasDict, inputCanvasId], (canvasDict, canvasId): string =>
  viewBoxString({ viewBox: canvasDict[canvasId].viewBox }),
);

export const getCanvasElementIds = createSelector(
  [getCanvasDict, inputCanvasId],
  (canvasDict, canvasId): string[] => canvasDict[canvasId].elementIds,
);

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

export const getCurrentUserAction = createSelector(
  [getCanvasDict, inputCanvasId],
  (canvasDict, canvasId): UserAction => canvasDict[canvasId].currentUserAction,
);

export const getDefaultElementStyle = createSelector(
  [getCanvasDict, getStyleDict, getGlobalSettings, inputCanvasId],
  (canvasDict, styleDict, globalSettings, canvasId): Style => {
    const canvas = canvasDict[canvasId];
    const localDefaultStyle = canvas.localSettings?.defaultElementStyle;
    const defaultStyle = localDefaultStyle || globalSettings.defaultElementStyle;
    return styleDict[defaultStyle];
  },
);

export const getSelectionRectStyle = createSelector(
  [getCanvasDict, getGlobalSettings, inputCanvasId],
  (canvasDict, globalSettings, canvasId): Style => {
    const canvas = canvasDict[canvasId];
    const localStyle = canvas.localSettings?.selectionBoxStyle;
    return localStyle || globalSettings.selectionBoxStyle;
  },
);

export const getHighlightedElementStyle = createSelector(
  [getCanvasDict, getGlobalSettings, inputCanvasId],
  (canvasDict, globalSettings, canvasId): Style => {
    const canvas = canvasDict[canvasId];
    const localStyle = canvas.localSettings?.highlightedElementStyle;
    return localStyle || globalSettings.highlightedElementStyle;
  },
);

export const getSelectedElementIds = createSelector(
  [getCanvasDict, inputCanvasId],
  (canvasDict, canvasId): string[] => canvasDict[canvasId].selectedElementIds,
);

export const getAllElementAreas = createSelector(
  [getCanvasDict, getElementDict, getShapeDict, inputCanvasId],
  (canvasDict, elementDict, shapeDict, canvasId): ShapeArea[] => {
    const canvas = canvasDict[canvasId];
    return canvas.elementIds.map((elementId) => {
      const shapeId = elementDict[elementId].shapeId;
      const shape = shapeDict[shapeId];
      const rawArea = getShapeArea({ shape });
      return {
        elementId,
        shapeId,
        ...rawArea,
      };
    });
  },
);

export const getMinimalRectContainingElements = createSelector(
  [
    getElementDict,
    getShapeDict,
    (state: RootState, elementIds: string[]): string[] => elementIds,
    (state: RootState, elementIds: string[], shapes?: AnyShape[]): AnyShape[] | undefined => shapes,
  ],
  (elementDict, shapeDict, elementIds, shapes): NewShapeGeneric<Rect> => {
    if (elementIds.length === 0 && !shapes) {
      throw new Error("Can't calculate minimal rect for empty element list");
    }

    // collect areas of all elements
    const elementAreas = elementIds.map((elementId) => {
      const element = elementDict[elementId];
      const shape = shapeDict[element.shapeId];
      return getShapeArea({ shape });
    });

    // add areas of all directly passed shapes
    (shapes || []).forEach((shape) => {
      elementAreas.push(getShapeArea({ shape }));
    });

    // calculate minimal rect containing all areas
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
  },
);
