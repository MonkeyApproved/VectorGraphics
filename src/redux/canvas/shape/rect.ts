import { GetShapeContextStructure } from '../context';
import { getAreaContainingCoordinates } from '../coordinateMath';
import { Area, Length } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams } from './shape';

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

export const getNewRect: GetNewShape<Rect> = ({ start, end }) => {
  return {
    type: 'rect',
    ...getAreaContainingCoordinates({ coordinateList: [start, end] }),
  };
};

export const getRectArea: GetShapeArea<Rect> = ({ shape }) => {
  const x1 = shape.position.x;
  const x2 = shape.position.x + shape.size.width;
  const y1 = shape.position.y;
  const y2 = shape.position.y + shape.size.height;
  return {
    minX: Math.min(x1, x2),
    centerX: (x1 + x2) / 2,
    maxX: Math.max(x1, x2),
    minY: Math.min(y1, y2),
    centerY: (y1 + y2) / 2,
    maxY: Math.max(y1, y2),
  };
};

export const getRectContext: GetShapeContextStructure<Rect> = ({ shape }) => {
  return [
    {
      label: 'position',
      contexts: [
        {
          name: 'positionX',
          usage: 'position',
          dimension: 'x',
          label: 'x',
          initialValue: shape.position.x,
        },
        {
          name: 'positionY',
          usage: 'position',
          dimension: 'y',
          label: 'y',
          initialValue: shape.position.y,
        },
      ],
    },
    {
      label: 'size',
      contexts: [
        {
          name: 'width',
          usage: 'size',
          dimension: 'x',
          initialValue: shape.size.width,
        },
        {
          name: 'height',
          usage: 'size',
          dimension: 'y',
          initialValue: shape.size.height,
        },
      ],
    },
    {
      label: 'corner radius',
      contexts: [
        {
          name: 'cornerRadiusX',
          usage: 'radius',
          dimension: 'x',
          label: 'x',
          initialValue: shape.cornerRadiusX || 0,
        },
        {
          name: 'cornerRadiusY',
          usage: 'size',
          dimension: 'y',
          label: 'y',
          initialValue: shape.cornerRadiusY || 0,
        },
      ],
    },
  ];
};
