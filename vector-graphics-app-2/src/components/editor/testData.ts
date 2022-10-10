import { BaseElement, getId } from '../svg/element';
import { ElementDict } from '../svg/elementDict';
import { defaultFillStyle } from '../svg/fill';
import { defaultStrokeStyle } from '../svg/stroke';

export const rectId = getId();
export const circleId = getId();
export const lineId = getId();

export const sampleRect: BaseElement = {
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
  enableDrag: true,
};

export const sampleCircle: BaseElement = {
  id: circleId,
  type: 'ellipse',
  stroke: defaultStrokeStyle,
  fill: {
    color: 'red',
  },
  position: { x: 50, y: 50 },
  size: { x: 40, y: 20 },
  enableDrag: true,
};

export const sampleLine: BaseElement = {
  id: lineId,
  type: 'line',
  stroke: defaultStrokeStyle,
  position: { x: 0, y: 0 },
  size: { x: 50, y: 100 },
  enableDrag: true,
};

const elementDict: ElementDict = {};
elementDict[circleId] = sampleCircle;
elementDict[rectId] = sampleRect;
elementDict[lineId] = sampleLine;

export const sampleElements = elementDict;
