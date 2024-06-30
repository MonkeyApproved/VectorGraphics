import { createElement } from 'react';
import { getDefaultElementStyle, useAppSelector } from 'src/redux/selectors';
import { NewShape } from 'src/redux/types';
import { getSvgShapeParams, getSvgStyleParams } from 'src/redux/utils';

export default function TempShape({ tempShape, canvasId }: { tempShape: NewShape; canvasId: string }) {
  const defaultStyle = useAppSelector((state) => getDefaultElementStyle(state, canvasId));
  const attributes = getSvgShapeParams({ shape: tempShape });
  const style = getSvgStyleParams({ style: defaultStyle });
  return createElement(tempShape.type, { ...attributes, style });
}
