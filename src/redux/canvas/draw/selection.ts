import * as d3 from 'd3';
import { Canvas, DrawAction, getTopCanvasId } from '../canvas';
import { appendElement } from './append';
import { setStyleAttributes } from './updateShape';

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;

export function selectElementById({ elementId }: { elementId: string }): ElementSelection | undefined {
  const selection = d3.select(`#${elementId}`);
  if (selection.empty()) {
    // no element with this id has been found
    return undefined;
  }
  return selection as ElementSelection;
}

export const NEW_SHAPE_ID = 'newShapeTemp';
export function selectTempShape({ canvas }: { canvas: Canvas<DrawAction> }): ElementSelection {
  // check if the shape is already added to the canvas
  const existingShape = selectElementById({ elementId: NEW_SHAPE_ID });
  if (existingShape) {
    return existingShape;
  }

  // if the shape does not exist, we add it to the top canvas
  return addTempShapeToCanvas({ canvas });
}

export function addTempShapeToCanvas({ canvas }: { canvas: Canvas<DrawAction> }): ElementSelection {
  const topCanvasId = getTopCanvasId({ canvasId: canvas.id });
  const canvasSelection = selectElementById({ elementId: topCanvasId });
  if (!canvasSelection) {
    throw new Error(`Canvas with id ${topCanvasId} not found`);
  }
  const tempShape = appendElement({ parent: canvasSelection, elementType: canvas.currentUserAction.shapeType });
  tempShape.attr('id', NEW_SHAPE_ID);
  setStyleAttributes({ selection: tempShape });
  return tempShape;
}
