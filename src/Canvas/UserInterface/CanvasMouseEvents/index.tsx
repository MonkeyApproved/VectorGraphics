import { RefObject, useState } from 'react';
import { getCurrentUserAction, getSelectedElementIds, useAppSelector } from 'src/redux/selectors';
import { Coordinate, ElementDetails } from 'src/redux/types';
import { ReactMouseEvent, ReactSetState } from '../types';
import { getMousePosition } from '../utils';
import DrawShape from './DrawShape';
import ElementInteraction from './ElementInteraction';
import Idle from './Idle';
import SelectElements from './SelectElements';

interface CanvasMouseEventProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  setStatus: ReactSetState<string>;
  setElementShownInMenu: ReactSetState<ElementDetails | undefined>;
}

// string is used to store elementId for mouse down on elements
export type MouseState = 'idle' | 'mouseDownCanvas' | 'mouseDownElement';

export default function CanvasMouseEvents({
  canvasId,
  canvasRef,
  setStatus,
  setElementShownInMenu,
}: CanvasMouseEventProps) {
  // current redux state
  const currentUserAction = useAppSelector((state) => getCurrentUserAction(state, canvasId));
  const selectedElements = useAppSelector((state) => getSelectedElementIds(state, canvasId));
  // mouse action state (this manages mouse down events on canvas and elements)
  const [mouseDownPosition, setMouseDownPosition] = useState<Coordinate | undefined>();
  const [mouseDownTarget, setMouseDownTarget] = useState<string | undefined>();
  const [mouseState, setMouseState] = useState<MouseState>('idle');

  // handler for mouse down events
  const startCanvasMouseAction = (event: ReactMouseEvent) => {
    if (mouseState !== 'idle') {
      // the previous mouse action is still active: nothing to do
      // this might happen in case of events allowing for multiple clicks
      return;
    }

    // update mouse action state for canvas event
    setMouseDownPosition(getMousePosition({ event, canvas: canvasRef }));
    setMouseState('mouseDownCanvas');
  };

  const startElementMouseAction = (event: ReactMouseEvent, elementId: string) => {
    if (mouseState !== 'idle' || currentUserAction.type === 'drawShape') {
      // we only start a new action if the mouse is idle and for draw actions,
      // we don't have any element specific actions and let the event bubble to the canvas
      return;
    }
    // make sure the event does not reach the canvas
    event.stopPropagation();

    // update mouse action state
    setMouseDownPosition(getMousePosition({ event, canvas: canvasRef }));
    setMouseDownTarget(elementId);
    setMouseState('mouseDownElement');
  };

  if (!mouseDownPosition || mouseState === 'idle') {
    // show all current elements and the selection rect
    // additionally, we listen for any mouse down event on canvas or elements
    return (
      <Idle
        canvasId={canvasId}
        onMouseDownCanvas={startCanvasMouseAction}
        onMouseDownElement={startElementMouseAction}
        selectedElements={selectedElements}
      />
    );
  } else if (currentUserAction.type === 'drawShape') {
    // add a new SVG shape to the canvas
    // the initial mouse down position determines the start of the shape
    return (
      <DrawShape
        canvasId={canvasId}
        canvasRef={canvasRef}
        shapeType={currentUserAction.shapeType}
        mouseDownPosition={mouseDownPosition}
        selectedElements={selectedElements}
        setMouseState={setMouseState}
        setElementShownInMenu={setElementShownInMenu}
        setStatus={setStatus}
      />
    );
  } else if (currentUserAction.type === 'select' && mouseState === 'mouseDownCanvas') {
    // draw a selection rect to select multiple elements
    // the initial mouse down position determines the start of the rect
    return (
      <SelectElements
        canvasId={canvasId}
        canvasRef={canvasRef}
        mouseDownPosition={mouseDownPosition}
        setMouseState={setMouseState}
        setStatus={setStatus}
      />
    );
  } else if (currentUserAction.type === 'select' && mouseState === 'mouseDownElement' && mouseDownTarget) {
    // (de)select a single element and potentially drag it to a new position
    return (
      <ElementInteraction
        canvasId={canvasId}
        canvasRef={canvasRef}
        targetElement={mouseDownTarget}
        selectedElements={selectedElements}
        mouseDownPosition={mouseDownPosition}
        setMouseState={setMouseState}
        setStatus={setStatus}
      />
    );
  }
  return <></>;
}
