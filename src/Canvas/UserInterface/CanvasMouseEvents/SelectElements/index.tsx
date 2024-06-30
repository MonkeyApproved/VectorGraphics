import { Coordinate } from 'src/redux/types';
import { getMousePosition } from '../../utils';
import { getNewRect, getTopCanvasId, isShapeAreaInRect } from 'src/redux/utils';
import { setSelectedElements as setSelectedCanvasElements, useAppDispatch } from 'src/redux/reducers';
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';
import { getAllElementAreas, getCanvas, useAppSelector } from 'src/redux/selectors';
import styles from '../styles.module.css';
import SelectionRect from './SelectionRect';
import { Rect, NewShapeGeneric } from 'src/redux/canvas/shape';
import { ReactSetState } from '../../types';
import SelectedElements from './SelectedElements';

export interface DrawSimpleShapeProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  mouseDownPosition: Coordinate;
  setMouseActionActive: Dispatch<SetStateAction<boolean>>;
  setStatus: ReactSetState<string>;
}

export type SelectionRect = NewShapeGeneric<Rect>;

export default function SelectElements({
  canvasId,
  canvasRef,
  mouseDownPosition,
  setMouseActionActive,
  setStatus,
}: DrawSimpleShapeProps) {
  // current redux state
  const canvas = useAppSelector((state) => getCanvas(state, canvasId));
  const elementAreas = useAppSelector((state) => getAllElementAreas(state, canvasId));
  const dispatch = useAppDispatch();
  // selection rect state
  const topCanvasId = getTopCanvasId({ canvasId });
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [rect, setRect] = useState<SelectionRect>(getNewRect({ start: mouseDownPosition, end: mouseDownPosition }));

  useEffect(() => {
    document.body.addEventListener('mousemove', updateSelection);
    document.body.addEventListener('mouseup', submitSelection);
    document.body.addEventListener('mouseleave', submitSelection);

    return () => {
      document.body.removeEventListener('mousemove', updateSelection);
      document.body.removeEventListener('mouseup', submitSelection);
      document.body.removeEventListener('mouseleave', submitSelection);
    };
  }, []);

  const updateSelectionRect = ({ event }: { event: MouseEvent }): SelectionRect => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    const currentRect = getNewRect({ start: mouseDownPosition, end: currentPosition });
    setRect(currentRect);
    return currentRect;
  };

  const updateSelectedElements = ({ selectionRect }: { selectionRect: SelectionRect }): string[] => {
    const selected: string[] = [];
    elementAreas.forEach((shapeArea) => {
      if (isShapeAreaInRect({ shapeArea, rect: selectionRect })) selected.push(shapeArea.elementId);
    });
    setStatus(`Drag mouse to select multiple elements (${selected.length} selected)`);
    setSelectedElements(selected);
    return selected;
  };

  const updateSelection = (event: MouseEvent) => {
    // update the temp shape with the current mouse position
    const selectionRect = updateSelectionRect({ event });
    updateSelectedElements({ selectionRect });
  };

  const submitSelection = (event: MouseEvent) => {
    // update selection with latest mouse position
    const selectionRect = updateSelectionRect({ event });
    const selected = updateSelectedElements({ selectionRect });

    // submit selected elements to redux store
    dispatch(setSelectedCanvasElements({ canvasId, elements: selected }));

    // finally, we inform CanvasMouseEvents that the current mouse action is finished
    setMouseActionActive(false);
  };

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={canvas.viewBox}>
      {
        <SelectedElements
          canvasId={canvasId}
          selectedElements={selectedElements}
          showMinimalRect={false}
          selectionRect={rect}
        />
      }
    </svg>
  );
}
