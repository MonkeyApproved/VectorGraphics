import { Area, Length } from '../types';
import { BaseShape, GetSvgParams } from './shape';

export interface Rect extends Area, BaseShape {
  type: 'rect';
  cornerRadiusX?: Length;
  cornerRadiusY?: Length;
}

export const getRectParams: GetSvgParams<Rect> = ({ shape }) => {
  return {
    x: shape.position.x,
    y: shape.position.y,
    width: shape.size.width,
    height: shape.size.height,
    rx: shape.cornerRadiusX,
    ry: shape.cornerRadiusY,
  };
};
