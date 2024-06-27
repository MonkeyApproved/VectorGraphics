import * as d3 from 'd3';
import { getMainCanvasId } from 'src/redux/utils';

export type ElementSelection = d3.Selection<d3.BaseType, unknown, HTMLElement, undefined>;

export function selectElementById({ elementId }: { elementId: string }): ElementSelection | undefined {
  const selection = d3.select(`#${elementId}`);
  if (selection.empty()) {
    // no element with this id has been found
    return undefined;
  }
  return selection as ElementSelection;
}

export function selectExistingCanvas({ canvasId }: { canvasId: string }): ElementSelection {
  const canvasSelection = selectElementById({ elementId: getMainCanvasId({ canvasId }) });
  if (!canvasSelection) {
    throw new Error(`Canvas with id ${canvasId} not found`);
  }
  return canvasSelection;
}

export function selectElementInParent({
  parentId,
  elementId,
}: {
  parentId: string;
  elementId: string;
}): ElementSelection | undefined {
  const parent = selectElementById({ elementId: parentId });
  if (!parent) {
    throw new Error(`Parent element with id ${parentId} not found`);
  }
  return parent?.select(`#${elementId}`);
}
