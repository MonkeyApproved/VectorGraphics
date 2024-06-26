import { RefObject, useState } from 'react';
import { Coordinate, ShapeType } from 'src/redux/types';
import { ElementSelection } from '../svgStateManagement/selectElement';
import { getMousePosition } from '../utils';
import { appendSelectionRectToCanvas, appendTempShapeToCanvas } from '../svgStateManagement/appendElement';
import DrawSimpleShape from './DrawSimpleShape';
import { getCanvasSettings, getCurrentUserAction, useAppSelector } from 'src/redux/selectors';
import styles from './styles.module.css';
import { ReactMouseEvent } from '../types';
import DrawPointShape from './DrawPointShape';

interface CanvasMouseEventProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
}

export const pointShapeTypes: ShapeType[] = ['polygon', 'polyline', 'path'];

export default function CanvasMouseEvents({ canvasId, canvasRef }: CanvasMouseEventProps) {
  // mouse action state
  const [mouseDownPosition, setMouseDownPosition] = useState<Coordinate | undefined>();
  const [mouseActionActive, setMouseActionActive] = useState<boolean>(false);
  const [tempShape, setTempShape] = useState<ElementSelection | undefined>();
  // current redux state
  const currentUserAction = useAppSelector(getCurrentUserAction({ canvasId }));
  const canvasSettings = useAppSelector(getCanvasSettings({ canvasId }));

  const startMouseAction = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (mouseActionActive) {
      // the previous mouse action is still active: nothing to do
      // this might happen in case of events allowing for multiple clicks
      return;
    }

    // we need to start a new mouse action
    setMouseActionActive(true);

    // remember the mouse down position
    const position = getMousePosition({ event, canvas: canvasRef });
    setMouseDownPosition(position);

    // create a new temporary shape
    if (currentUserAction.type === 'drawShape') {
      console.warn(currentUserAction.shapeType);
      const shape = appendTempShapeToCanvas({ canvasId, shapeType: currentUserAction.shapeType, canvasSettings });
      setTempShape(shape);
    } else if (currentUserAction.type === 'select') {
      const shape = appendSelectionRectToCanvas({ canvasId, canvasSettings });
      setTempShape(shape);
    }
  };

  if (!tempShape || !mouseDownPosition || !mouseActionActive) {
    return <div className={styles.mouseListener} onMouseDown={startMouseAction} />;
  } else if (currentUserAction.type === 'drawShape' && pointShapeTypes.includes(currentUserAction.shapeType)) {
    return (
      <DrawPointShape
        canvasId={canvasId}
        canvasRef={canvasRef}
        shapeType={currentUserAction.shapeType}
        mouseDownPosition={mouseDownPosition}
        tempShape={tempShape}
        setMouseActionActive={setMouseActionActive}
      />
    );
  } else if (currentUserAction.type === 'drawShape') {
    return (
      <DrawSimpleShape
        canvasId={canvasId}
        canvasRef={canvasRef}
        shapeType={currentUserAction.shapeType}
        mouseDownPosition={mouseDownPosition}
        tempShape={tempShape}
        setMouseActionActive={setMouseActionActive}
      />
    );
  }
  return null;
}
