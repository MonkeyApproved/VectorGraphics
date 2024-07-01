import { useEffect, useRef, useState } from 'react';
import { setSelectedElements, updateShape, useAppDispatch } from 'src/redux/reducers';
import { getCanvasElementDetails, getHighlightedElementStyle, useAppSelector } from 'src/redux/selectors';
import { Shape } from 'src/redux/types';
import { moveShape, subtractCoordinates, vectorLength } from 'src/redux/utils';
import { getMousePosition } from '../../utils';
import { ElementFromShape } from '../Elements/Element';
import SelectionRect from '../SelectionRect';
import { SelectElementsProps } from './index';
import { invertSelection } from './invertSelection';

export default function MoveElement({
  canvasId,
  canvasRef,
  targetElement,
  selectedElements,
  mouseDownPosition,
  setMouseState,
}: SelectElementsProps) {
  // initial state of the target element
  const element = useAppSelector((state) => getCanvasElementDetails(state, targetElement, canvasId));
  const style = useAppSelector((state) => getHighlightedElementStyle(state, canvasId));
  const dispatch = useAppDispatch();
  // updated state of the target shape
  const [currentShape, setCurrentShape] = useState<Shape>(element.shape); // used to update render
  const currentShapeRef = useRef<Shape>(currentShape); // used in the event listeners
  const dragUnlocked = useRef<boolean>(false);

  useEffect(() => {
    document.body.addEventListener('mousemove', moveElement);
    document.body.addEventListener('mouseup', finishDrag);
    document.body.addEventListener('mouseleave', finishDrag);

    return () => {
      document.body.removeEventListener('mousemove', moveElement);
      document.body.removeEventListener('mouseup', finishDrag);
      document.body.removeEventListener('mouseleave', finishDrag);
    };
  }, []);

  const finishDrag = () => {
    setMouseState('idle');
    dispatch(updateShape({ shape: currentShapeRef.current }));

    // check if we need to (de)select the element
    if (!dragUnlocked.current) {
      // if the element was not moved, we invert it's selection
      const updatedSelectedElements = invertSelection({ selectedElements, elementToInvert: targetElement });
      dispatch(setSelectedElements({ canvasId, elements: updatedSelectedElements }));
    } else if (!selectedElements.includes(targetElement)) {
      // if the element was moved it is always selected afterwards
      dispatch(setSelectedElements({ canvasId, elements: [...selectedElements, targetElement] }));
    }
  };

  const moveElement = (event: MouseEvent) => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    const offset = subtractCoordinates({ leftArg: currentPosition, rightArg: mouseDownPosition });

    // if mouse never moved more than 2 pixels in either direction, don't unlock drag
    if (!dragUnlocked.current && vectorLength({ coordinate: offset }) > 2) dragUnlocked.current = true;
    if (!dragUnlocked.current) return;

    // update the shape with the current mouse position
    const newShape = moveShape({ shape: currentShape, offset });
    setCurrentShape(newShape);
    currentShapeRef.current = newShape;
  };

  return (
    <>
      <ElementFromShape shape={currentShape} style={style} />
      <SelectionRect
        canvasId={canvasId}
        selectedElements={selectedElements.filter((id) => id !== targetElement)}
        additionalShapes={[currentShape]}
      />
    </>
  );
}
