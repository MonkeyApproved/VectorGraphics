import { DrawAction } from '../userAction';
import { Canvas, getTopCanvasId } from '../../canvas';
import { ElementSelection, selectElementById } from '../svgStateManagement/selectElement';
import { setStyleAttributes } from '../svgStateManagement/updateShape';
import { appendElement } from '../svgStateManagement/appendElement';
import { NewShape } from '../../shape';
import { Coordinate } from '../../types';

export const NEW_SHAPE_ID = 'newShapeTemp';

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

export function selectTempShape({ canvas }: { canvas: Canvas<DrawAction> }): ElementSelection {
  // check if the shape is already added to the canvas
  const existingShape = selectElementById({ elementId: NEW_SHAPE_ID });
  if (existingShape) {
    return existingShape;
  }

  // if the shape does not exist, we add it to the top canvas
  return addTempShapeToCanvas({ canvas });
}

export function removeTempShapeFromCanvas(): void {
  const tempShape = selectElementById({ elementId: NEW_SHAPE_ID });
  if (tempShape) {
    tempShape.remove();
  }
}

export function appendFinishedSegments({
  finishedSegments,
  current,
}: {
  finishedSegments: NewShape;
  current: Coordinate;
}): NewShape {
  if (finishedSegments.type === 'polygon' || finishedSegments.type === 'polyline') {
    // add the current coordinate as the next point
    return {
      ...finishedSegments,
      points: [...finishedSegments.points, current],
    };
  } else if (finishedSegments.type === 'path') {
    // extend by drawing a line to the current coordinate
    return {
      ...finishedSegments,
      segments: [...finishedSegments.segments, { type: 'line', endPoint: current }],
    };
  }
  return finishedSegments;
}
