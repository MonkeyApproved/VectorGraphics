import { Coordinate, NewShape, ShapeType } from 'src/redux/types';
import { ElementSelection } from '../svgStateManagement/selectElement';
import { getMousePosition } from '../utils';
import { getNewShape } from 'src/redux/utils';
import { removeElement } from '../svgStateManagement/removeElement';
import { addElementToCanvas, useAppDispatch } from 'src/redux/reducers';
import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import { setShapeAttributes } from '../svgStateManagement/updateShape';

export interface DrawSimpleShapeProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
  shapeType: ShapeType;
  mouseDownPosition: Coordinate;
  tempShape: ElementSelection;
  setMouseActionActive: Dispatch<SetStateAction<boolean>>;
}

export default function DrawSimpleShape({
  canvasId,
  canvasRef,
  shapeType,
  mouseDownPosition,
  tempShape,
  setMouseActionActive,
}: DrawSimpleShapeProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.body.addEventListener('mousemove', updateShape);
    document.body.addEventListener('mouseup', submitShape);
    document.body.addEventListener('mouseleave', submitShape);

    return () => {
      document.body.removeEventListener('mousemove', updateShape);
      document.body.removeEventListener('mouseup', submitShape);
      document.body.removeEventListener('mouseleave', submitShape);
    };
  }, []);

  const getCurrentShape = ({ event }: { event: MouseEvent }): NewShape => {
    const currentPosition = getMousePosition({ event, canvas: canvasRef });
    return getNewShape({
      shapeType: shapeType,
      start: mouseDownPosition,
      end: currentPosition,
    });
  };

  const updateShape = (event: MouseEvent) => {
    // update the temp shape with the current mouse position
    const currentShape = getCurrentShape({ event });
    setShapeAttributes({ shape: currentShape, selection: tempShape });
  };

  const submitShape = (event: MouseEvent) => {
    // update the shape with the final mouse position
    const finalShape = getCurrentShape({ event });

    // now we can remove the temp shape and submit the final shape to the store
    removeElement({ selection: tempShape });
    dispatch(addElementToCanvas({ canvasId, shape: finalShape }));

    // finally, we inform CanvasMouseEvents that the current mouse action is finished
    setMouseActionActive(false);
  };

  return null;
}
