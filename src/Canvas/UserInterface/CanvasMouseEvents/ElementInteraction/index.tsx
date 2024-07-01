import { Dispatch, RefObject, SetStateAction } from 'react';
import { getCanvasViewBoxString, useAppSelector } from 'src/redux/selectors';
import { Coordinate } from 'src/redux/types';
import { getTopCanvasId } from 'src/redux/utils';
import { MouseState } from '..';
import { ReactSetState } from '../../types';
import Elements from '../Elements';
import styles from '../styles.module.css';
import MoveElement from './MoveElement';
import { invertSelection } from './invertSelection';

export interface SelectElementsProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  targetElement: string;
  selectedElements: string[];
  mouseDownPosition: Coordinate; // this is a mouse down on the canvas
  setMouseState: Dispatch<SetStateAction<MouseState>>;
  setStatus: ReactSetState<string>;
}

export default function ElementInteraction({
  canvasId,
  canvasRef,
  targetElement,
  selectedElements,
  mouseDownPosition,
  setMouseState,
  setStatus,
}: SelectElementsProps) {
  // current redux state
  const viewBox = useAppSelector((state) => getCanvasViewBoxString(state, canvasId));

  // element selection state
  const topCanvasId = getTopCanvasId({ canvasId: canvasId });

  // the current selection or modified by (de)selecting the target element
  const currentlySelectedElements = invertSelection({ selectedElements, elementToInvert: targetElement });

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={viewBox}>
      <Elements canvasId={canvasId} selectedElements={currentlySelectedElements} hiddenElements={[targetElement]} />
      <MoveElement
        canvasId={canvasId}
        canvasRef={canvasRef}
        targetElement={targetElement}
        selectedElements={selectedElements}
        mouseDownPosition={mouseDownPosition}
        setMouseState={setMouseState}
        setStatus={setStatus}
      />
    </svg>
  );
}
