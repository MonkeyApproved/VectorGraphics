import { RefObject, useState } from 'react';
import { Coordinate } from 'src/redux/types';
import { getMousePosition } from '../utils';
import { getCurrentUserAction, useAppSelector } from 'src/redux/selectors';
import { ReactMouseEvent, ReactSetState } from '../types';
import DrawShape from './DrawShape';
import SelectElements from './SelectElements';
import Idle from './Idle';

interface CanvasMouseEventProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  setStatus: ReactSetState<string>;
}

export default function CanvasMouseEvents({ canvasId, canvasRef, setStatus }: CanvasMouseEventProps) {
  // mouse action state
  const [mouseDownPosition, setMouseDownPosition] = useState<Coordinate | undefined>();
  const [mouseDownTarget, setMouseDownTarget] = useState<string | undefined>();
  const [mouseActionActive, setMouseActionActive] = useState<boolean>(false);
  // current redux state
  const currentUserAction = useAppSelector((state) => getCurrentUserAction(state, canvasId));

  // handler for mouse down events
  const startMouseAction = (event: ReactMouseEvent) => {
    if (mouseActionActive) {
      // the previous mouse action is still active: nothing to do
      // this might happen in case of events allowing for multiple clicks
      return;
    }

    // update mouse action state
    const position = getMousePosition({ event, canvas: canvasRef });
    setMouseDownPosition(position);
    setMouseDownTarget((event.target as HTMLDivElement).id);
    setMouseActionActive(true);

    console.warn(mouseDownTarget);
  };

  if (!mouseDownPosition || !mouseActionActive) {
    return <Idle canvasId={canvasId} onMouseDown={startMouseAction} />;
  } else if (currentUserAction.type === 'drawShape') {
    return (
      <DrawShape
        canvasId={canvasId}
        canvasRef={canvasRef}
        shapeType={currentUserAction.shapeType}
        mouseDownPosition={mouseDownPosition}
        setMouseActionActive={setMouseActionActive}
        setStatus={setStatus}
      />
    );
  } else if (currentUserAction.type === 'select') {
    return (
      <SelectElements
        canvasId={canvasId}
        canvasRef={canvasRef}
        mouseDownPosition={mouseDownPosition}
        setMouseActionActive={setMouseActionActive}
        setStatus={setStatus}
      />
    );
  }
  return <></>;
}
