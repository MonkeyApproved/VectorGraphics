import { Ellipse } from '../svg/circle';
import { ElementDict, generateId } from '../svg/element';
import { defaultFillStyle } from '../svg/fill';
import { Line } from '../svg/line';
import { Rect } from '../svg/rect';
import { defaultStrokeStyle } from '../svg/stroke';

export const rectId = generateId();
export const circleId = generateId();
export const lineId = generateId();

export const sampleRect: Rect = {
  id: rectId,
  type: 'rect',
  stroke: defaultStrokeStyle,
  fill: defaultFillStyle,
  position: {
    x: 20,
    y: 20,
  },
  size: {
    x: 40,
    y: 30,
  },
};

export const sampleCircle: Ellipse = {
  id: circleId,
  type: 'ellipse',
  stroke: defaultStrokeStyle,
  fill: {
    color: 'red',
  },
  position: { x: 50, y: 50 },
  size: { x: 40, y: 20 },
};

export const sampleLine: Line = {
  id: lineId,
  type: 'line',
  stroke: defaultStrokeStyle,
  position: { x: 0, y: 0 },
  size: { x: 50, y: 100 },
};

const elementDict: ElementDict = {};
elementDict[circleId] = sampleCircle;
elementDict[rectId] = sampleRect;
elementDict[lineId] = sampleLine;

export const sampleElements = elementDict;
