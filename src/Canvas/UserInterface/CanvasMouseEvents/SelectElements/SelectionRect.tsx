import { createElement } from 'react';
import { NewShapeGeneric } from 'src/redux/canvas/shape';
import { getSelectionRectStyle, useAppSelector } from 'src/redux/selectors';
import { Rect } from 'src/redux/types';
import { getSvgShapeParams, getSvgStyleParams } from 'src/redux/utils';

export default function SelectionRect({
  rect,
  canvasId,
}: {
  rect: NewShapeGeneric<Rect> | undefined;
  canvasId: string;
}) {
  if (!rect) {
    return null;
  }
  const defaultStyle = useAppSelector((state) => getSelectionRectStyle(state, canvasId));
  const attributes = getSvgShapeParams({ shape: rect });
  const style = getSvgStyleParams({ style: defaultStyle });
  return createElement('rect', { ...attributes, style });
}
