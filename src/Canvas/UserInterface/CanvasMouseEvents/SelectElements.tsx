import { Coordinate } from 'src/redux/types';
import { getMousePosition } from '../utils';
import { getNewRect, getTopCanvasId } from 'src/redux/utils';
import { setSelectedElements, useAppDispatch } from 'src/redux/reducers';
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { getCanvas, useAppSelector } from 'src/redux/selectors';
import styles from './styles.module.css';
import SelectionRect from './SelectionRect';
import { Rect, TempShareGeneric } from 'src/redux/canvas/shape';
import { ReactSetState } from '../types';

export interface DrawSimpleShapeProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  mouseDownPosition: Coordinate;
  setMouseActionActive: Dispatch<SetStateAction<boolean>>;
  setStatus: ReactSetState<string>;
}

export default function SelectElements({
  canvasId,
  canvasRef,
  mouseDownPosition,
  setMouseActionActive,
  setStatus,
}: DrawSimpleShapeProps) {
  const canvas = useAppSelector(getCanvas({ canvasId }));
  const topCanvasId = getTopCanvasId({ canvasId });
  const selectedElements = useRef<string[]>([]);
  const [rect, setRect] = useState<TempShareGeneric<Rect>>(
    getNewRect({ start: mouseDownPosition, end: mouseDownPosition }),
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.addEventListener('mousemove', updateShape);
    document.body.addEventListener('mouseup', submitSelection);
    document.body.addEventListener('mouseleave', submitSelection);
    setStatus(`Drag mouse to select multiple elements (${selectedElements.current.length} selected)`);

    return () => {
      document.body.removeEventListener('mousemove', updateShape);
      document.body.removeEventListener('mouseup', submitSelection);
      document.body.removeEventListener('mouseleave', submitSelection);
    };
  }, []);

  const getCurrentShape = ({ event }: { event: MouseEvent }): TempShareGeneric<Rect> => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    return getNewRect({ start: mouseDownPosition, end: currentPosition });
  };

  const updateShape = (event: MouseEvent) => {
    // update the temp shape with the current mouse position
    setRect(getCurrentShape({ event }));
  };

  const submitSelection = (event: MouseEvent) => {
    // update selection with latest mouse position
    setRect(getCurrentShape({ event }));

    // submit selected elements to redux store
    dispatch(setSelectedElements({ canvasId, elements: [] }));

    // finally, we inform CanvasMouseEvents that the current mouse action is finished
    setMouseActionActive(false);
  };

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={canvas.viewBox}>
      <SelectionRect rect={rect} canvasId={canvasId} />
    </svg>
  );
}
