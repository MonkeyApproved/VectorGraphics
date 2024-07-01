import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { getCanvasViewBoxString, useAppSelector } from 'src/redux/selectors';
import { Coordinate } from 'src/redux/types';
import { getTopCanvasId } from 'src/redux/utils';
import { MouseState } from '..';
import { ReactSetState } from '../../types';
import Elements from '../Elements';
import styles from '../styles.module.css';
import SelectViaRect from './SelectViaRect';

export interface SelectElementsProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  mouseDownPosition: Coordinate; // this is a mouse down on the canvas
  setMouseState: Dispatch<SetStateAction<MouseState>>;
  setStatus: ReactSetState<string>;
}

export default function SelectElements(props: SelectElementsProps) {
  // current redux state
  const viewBox = useAppSelector((state) => getCanvasViewBoxString(state, props.canvasId));

  // element selection state
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const topCanvasId = getTopCanvasId({ canvasId: props.canvasId });

  return (
    <svg className={styles.topCanvas} id={topCanvasId} viewBox={viewBox}>
      <Elements canvasId={props.canvasId} selectedElements={selectedElements} />
      <SelectViaRect {...props} setSelectedElements={setSelectedElements} />
    </svg>
  );
}
