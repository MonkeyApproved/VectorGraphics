import { createElement } from 'react';
import { NewShapeGeneric } from 'src/redux/canvas/shape';
import { getMinimalRectContainingElements, getSelectionRectStyle, useAppSelector } from 'src/redux/selectors';
import { AnyShape, Rect } from 'src/redux/types';
import { getSvgShapeParams, getSvgStyleParams } from 'src/redux/utils';

export interface SelectionRectProps {
  canvasId: string;
  rect?: NewShapeGeneric<Rect> | undefined;
  selectedElements?: string[];
  additionalShapes?: AnyShape[];
}

export default function SelectionRect({ canvasId, rect, selectedElements, additionalShapes }: SelectionRectProps) {
  if (!rect && selectedElements?.length === 0 && !additionalShapes) {
    return null;
  }

  let rectUsed: NewShapeGeneric<Rect>;
  if (rect) {
    rectUsed = rect;
  } else if (selectedElements) {
    rectUsed = useAppSelector((state) => getMinimalRectContainingElements(state, selectedElements, additionalShapes));
  } else {
    return null;
  }

  const defaultStyle = useAppSelector((state) => getSelectionRectStyle(state, canvasId));
  const attributes = getSvgShapeParams({ shape: rectUsed });
  const style = getSvgStyleParams({ style: defaultStyle });
  return createElement('rect', { ...attributes, style });
}
