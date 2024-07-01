import { useEffect, useState } from 'react';
import { NewShapeGeneric, Rect } from 'src/redux/canvas/shape';
import { setSelectedElements as setSelectedCanvasElements, useAppDispatch } from 'src/redux/reducers';
import { getAllElementAreas, useAppSelector } from 'src/redux/selectors';
import { getNewRect, isShapeAreaInRect } from 'src/redux/utils';
import { ReactSetState } from '../../types';
import { getMousePosition } from '../../utils';
import SelectionRect from '../SelectionRect';
import { SelectElementsProps } from './index';

export interface SelectViaRectProps extends SelectElementsProps {
  setSelectedElements: ReactSetState<string[]>;
}

export default function SelectViaRect({
  canvasId,
  canvasRef,
  mouseDownPosition,
  setMouseState,
  setStatus,
  setSelectedElements,
}: SelectViaRectProps) {
  // current redux state
  const elementAreas = useAppSelector((state) => getAllElementAreas(state, canvasId));
  const dispatch = useAppDispatch();
  // selection rect state
  const [rect, setRect] = useState<NewShapeGeneric<Rect>>(
    getNewRect({ start: mouseDownPosition, end: mouseDownPosition }),
  );

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

  const updateSelectionRect = ({ event }: { event: MouseEvent }): NewShapeGeneric<Rect> => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    const currentRect = getNewRect({ start: mouseDownPosition, end: currentPosition });
    setRect(currentRect);
    return currentRect;
  };

  const updateSelectedElements = ({ selectionRect }: { selectionRect: NewShapeGeneric<Rect> }): string[] => {
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
    setMouseState('idle');
  };

  return <SelectionRect canvasId={canvasId} rect={rect} />;
}
