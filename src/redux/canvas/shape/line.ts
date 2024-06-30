import { GetShapeContextStructure } from '../context';
import { Coordinate } from '../types';
import { BaseShape, GetNewShape, GetShapeArea, GetSvgParams, UpdateShapeFromNamespace } from './shape';

export interface Line extends BaseShape {
  type: 'line';
  start: Coordinate;
  end: Coordinate;
}

export const getLineParams: GetSvgParams<Line> = ({ shape }) => {
  return {
    x1: shape.start.x,
    y1: shape.start.y,
    x2: shape.end.x,
    y2: shape.end.y,
  };
};

export const getNewLine: GetNewShape<Line> = ({ start, end }) => {
  return {
    type: 'line',
    start,
    end,
  };
};

export const getLineArea: GetShapeArea<Line> = ({ shape }) => {
  const x1 = shape.start.x;
  const x2 = shape.end.x;
  const y1 = shape.start.y;
  const y2 = shape.end.y;
  return {
    minX: Math.min(x1, x2),
    centerX: (x1 + x2) / 2,
    maxX: Math.max(x1, x2),
    minY: Math.min(y1, y2),
    centerY: (y1 + y2) / 2,
    maxY: Math.max(y1, y2),
  };
};

export const StartXContextName = 'startX';
export const StartYContextName = 'startY';
export const EndXContextName = 'endX';
export const EndYContextName = 'endY';
export const getLineContext: GetShapeContextStructure<Line> = ({ shape }) => {
  return [
    {
      type: 'group',
      label: 'start',
      contexts: [
        {
          name: StartXContextName,
          usage: 'position',
          dimension: 'x',
          label: 'x',
          initialValue: shape.start.x,
        },
        {
          name: StartYContextName,
          usage: 'position',
          dimension: 'y',
          label: 'y',
          initialValue: shape.start.y,
        },
      ],
    },
    {
      type: 'group',
      label: 'end',
      contexts: [
        {
          name: EndXContextName,
          usage: 'position',
          dimension: 'x',
          label: 'x',
          initialValue: shape.end.x,
        },
        {
          name: EndYContextName,
          usage: 'position',
          dimension: 'y',
          label: 'y',
          initialValue: shape.end.y,
        },
      ],
    },
  ];
};

export const updateLineFromNamespace: UpdateShapeFromNamespace<Line> = ({ shape, namespace }) => {
  const equations = namespace.equations;
  console.warn(equations);
  return {
    ...shape,
    namespaceVersion: namespace.version,
    start: {
      x: equations[StartXContextName]?.lastValidNumber || shape.start.x,
      y: equations[StartYContextName]?.lastValidNumber || shape.start.y,
    },
    end: {
      x: equations[EndXContextName]?.lastValidNumber || shape.end.x,
      y: equations[EndYContextName]?.lastValidNumber || shape.end.y,
    },
  };
};
