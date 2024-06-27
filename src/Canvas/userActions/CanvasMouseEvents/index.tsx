import { RefObject, useState } from 'react';
import { Coordinate } from 'src/redux/types';
import { getMousePosition } from '../utils';
import { getCurrentUserAction, useAppSelector } from 'src/redux/selectors';
import styles from './styles.module.css';
import { ReactMouseEvent } from '../types';
import DrawShape from './DrawShape';
import SelectElements from './SelectElements';

interface CanvasMouseEventProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
}

export default function CanvasMouseEvents({ canvasId, canvasRef }: CanvasMouseEventProps) {
  // mouse action state
  const [mouseDownPosition, setMouseDownPosition] = useState<Coordinate | undefined>();
  const [mouseDownTarget, setMouseDownTarget] = useState<string | undefined>();
  const [mouseActionActive, setMouseActionActive] = useState<boolean>(false);
  // current redux state
  const currentUserAction = useAppSelector(getCurrentUserAction({ canvasId }));

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
    return <div className={styles.mouseListener} onMouseDown={startMouseAction} />;
  } else if (currentUserAction.type === 'drawShape') {
    return (
      <DrawShape
        canvasId={canvasId}
        currentUserAction={currentUserAction}
        canvasRef={canvasRef}
        shapeType={currentUserAction.shapeType}
        mouseDownPosition={mouseDownPosition}
        setMouseActionActive={setMouseActionActive}
      />
    );
  } else if (currentUserAction.type === 'select') {
    return (
      <SelectElements
        canvasId={canvasId}
        canvasRef={canvasRef}
        mouseDownPosition={mouseDownPosition}
        setMouseActionActive={setMouseActionActive}
      />
    );
  }
  return <></>;
}
