import * as d3 from 'd3';
import { Canvas, getMainCanvasId } from '../../canvas';

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;

export function selectElementById({ elementId }: { elementId: string }): ElementSelection | undefined {
  const selection = d3.select(`#${elementId}`);
  if (selection.empty()) {
    // no element with this id has been found
    return undefined;
  }
  return selection as ElementSelection;
}

export function selectExistingCanvas({ canvas }: { canvas: Canvas }) {
  const canvasSelection = selectElementById({ elementId: getMainCanvasId({ canvasId: canvas.id }) });
  if (!canvasSelection) {
    throw new Error(`Canvas with id ${canvas.id} not found`);
  }
  return canvasSelection;
}
