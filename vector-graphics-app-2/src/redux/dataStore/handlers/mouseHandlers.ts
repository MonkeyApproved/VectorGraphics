import { DataSliceReducer, DataState } from '../dataSlice';
import { getCoordinate } from '../equations/equation';
import { applyPosition, Coordinate, getPositionAfterDrag, setPosition } from '../svg/coordinate';
import { selectElementById } from '../svg/element';

/*
  The mouse handlers are modeled as action of our redux store (check dataSlice.ts).

  Those actions are triggered from the SvgCanvas component, where the different mouse handlers are added to the main
  <svg /> element containing all the svg elements.
*/

export type MouseStatus = 'idle' | 'mouseDownElement' | 'mouseDragElement' | 'mouseDownCanvas' | 'mouseDragCanvas';

export interface CanvasMouseEvent {
  status: MouseStatus;
  targetId: string;
  initialElementPosition?: Coordinate;
  initialMousePosition?: Coordinate;
  currentMousePosition?: Coordinate;
}

function updateElementPositionDuringDrag({
  state,
  currentMousePosition,
}: {
  state: DataState;
  currentMousePosition: Coordinate;
}) {
  // dragging of an element completed -> apply final position
  if (!state.mouseEvent.initialElementPosition || !state.mouseEvent.initialMousePosition) {
    return;
  }
  // get element from dict
  const elementId = state.mouseEvent.targetId;
  const element = state.svg.elementDict[elementId];

  // update state
  const finalPosition = getPositionAfterDrag({
    initialElementPosition: state.mouseEvent.initialElementPosition,
    initialMousePosition: state.mouseEvent.initialMousePosition,
    currentMousePosition,
  });
  setPosition({ element, ...finalPosition, state });

  // update element position on canvas
  const elementSelection = selectElementById({ elementId });
  applyPosition({ element, elementSelection, state });
}

const mouseDown: DataSliceReducer<{ targetId: string; canvasPosition: Coordinate }> = (state, { payload }) => {
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
      initialElementPosition: getCoordinate({ coordinateEquations: element.position, state }),
      initialMousePosition: payload.canvasPosition,
    };
    state.svg.selectedElementId = payload.targetId;
  }
};

const mouseDrag: DataSliceReducer<{ canvasPosition: Coordinate }> = (state, { payload }) => {
  // depending on which mouse action is active, we have to perform different state updates:
  switch (state.mouseEvent.status) {
    case 'mouseDownCanvas':
    case 'mouseDragCanvas':
      // dragging the mouse over canvas -> TODO: show selection box
      state.mouseEvent.status = 'mouseDragCanvas';
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

const mouseUp: DataSliceReducer<{ canvasPosition: Coordinate }> = (state, { payload }) => {
  // depending on which mouse action is active, we have to perform different state updates:
  switch (state.mouseEvent.status) {
    case 'mouseDownCanvas':
      // click onto the svg canvas outside any elements -> deselect everything
      state.svg.selectedElementId = undefined;
      break;
    case 'mouseDownElement':
      // click on a single element -> select element
      state.svg.selectedElementId = state.mouseEvent.targetId;
      break;
    case 'mouseDragCanvas':
      // selection of potentially multiple elements -> TODO: multi element select
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
