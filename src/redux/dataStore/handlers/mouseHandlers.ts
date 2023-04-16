import { DataSliceReducer, DataState } from '../dataSlice';
import { applyElementPosition } from '../svg/applyAttributes';
import { CoordinatePixels, getOffsetAfterDrag } from '../svg/coordinate';
import { selectElementById } from '../svg/element';
import { completeSelectionBoxOnMouseUp, updateSelectionBoxDuringDrag } from './selectionBox';

/*
  The mouse handlers are modeled as action of our redux store (check dataSlice.ts).

  Those actions are triggered from the SvgCanvas component, where the different mouse handlers are added to the main
  <svg /> element containing all the svg elements.
*/

export type MouseStatus = 'idle' | 'mouseDownElement' | 'mouseDragElement' | 'mouseDownCanvas' | 'mouseDragCanvas';

export interface CanvasMouseEvent {
  status: MouseStatus;
  targetId: string;
  initialElementOffset?: CoordinatePixels;
  initialMousePosition?: CoordinatePixels;
  currentMousePosition?: CoordinatePixels;
}

function updateElementPositionDuringDrag({
  state,
  currentMousePosition,
}: {
  state: DataState;
  currentMousePosition: CoordinatePixels;
}) {
  // dragging of an element completed -> apply final position
  if (!state.mouseEvent.initialElementOffset || !state.mouseEvent.initialMousePosition) {
    return;
  }
  // get element from dict
  const elementId = state.mouseEvent.targetId;
  const element = state.svg.elementDict[elementId];

  // update state
  const finalOffset = getOffsetAfterDrag({
    initialElementOffset: state.mouseEvent.initialElementOffset,
    initialMousePosition: state.mouseEvent.initialMousePosition,
    currentMousePosition,
  });
  element.position.xOffset = finalOffset.x;
  element.position.yOffset = finalOffset.y;

  // update element position on canvas
  applyElementPosition({ element, elementSelection: selectElementById({ elementId }), state });
}

const mouseDown: DataSliceReducer<{ targetId: string; canvasPosition: CoordinatePixels }> = (state, { payload }) => {
  if (payload.targetId === state.svg.canvasId) {
    // the mouse did not target any elements, but directly hit the canvas
    state.mouseEvent = {
      status: 'mouseDownCanvas',
      targetId: payload.targetId,
      initialMousePosition: payload.canvasPosition,
    };
  } else if (state.svg.elementDict[payload.targetId]) {
    // the mouse pointer was on a svg element -> update mouse event and select element
    const element = state.svg.elementDict[payload.targetId];
    state.mouseEvent = {
      status: 'mouseDownElement',
      targetId: payload.targetId,
      initialElementOffset: { x: element.position.xOffset || 0, y: element.position.yOffset || 0 },
      initialMousePosition: payload.canvasPosition,
    };
    state.svg.selectedElementIds = [payload.targetId];
  }
};

const mouseDrag: DataSliceReducer<{ canvasPosition: CoordinatePixels }> = (state, { payload }) => {
  // depending on which mouse action is active, we have to perform different state updates:
  switch (state.mouseEvent.status) {
    case 'mouseDownCanvas':
    case 'mouseDragCanvas':
      // dragging the mouse over canvas -> update mouse status
      state.mouseEvent.status = 'mouseDragCanvas';
      // show selection box
      updateSelectionBoxDuringDrag({ state, currentMousePosition: payload.canvasPosition });
      break;
    case 'mouseDownElement':
    case 'mouseDragElement': {
      // dragging an element -> update mouse status to differentiate from click (only mouse up & down, no drag)
      state.mouseEvent.status = 'mouseDragElement';
      // update element position in state and canvas
      updateElementPositionDuringDrag({ state, currentMousePosition: payload.canvasPosition });
      break;
    }
  }
};

const mouseUp: DataSliceReducer<{ canvasPosition: CoordinatePixels }> = (state, { payload }) => {
  // depending on which mouse action is active, we have to perform different state updates:
  switch (state.mouseEvent.status) {
    case 'mouseDownCanvas':
      // click onto the svg canvas outside any elements -> deselect everything
      state.svg.selectedElementIds = [];
      break;
    case 'mouseDragCanvas':
      // new element or selection box was drawn
      completeSelectionBoxOnMouseUp({ state, currentMousePosition: payload.canvasPosition });
      break;
    case 'mouseDownElement':
      // click on a single element -> select element
      state.svg.selectedElementIds = [state.mouseEvent.targetId];
      break;
    case 'mouseDragElement': {
      // update dragged element's position in state and canvas
      updateElementPositionDuringDrag({ state, currentMousePosition: payload.canvasPosition });
      break;
    }
  }
  state.mouseEvent.status = 'idle';
};

export const mouseReducers = {
  mouseDown,
  mouseDrag,
  mouseUp,
};
