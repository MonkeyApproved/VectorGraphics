import * as d3 from 'd3';
import { Canvas, DrawAction } from '../canvas';
import { addTempShapeToCanvas } from './append';

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
