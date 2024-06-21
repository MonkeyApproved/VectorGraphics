import { Canvas, DrawAction, getTopCanvasId } from '../canvas';
import { ElementSelection, NEW_SHAPE_ID, selectElementById } from './selection';
import { setStyleAttributes } from './updateShape';

export function appendElement({
  parent,
  elementType,
}: {
  parent: ElementSelection;
  elementType: string;
}): ElementSelection {
  return parent.append(elementType);
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
