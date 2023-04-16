import { BaseElement } from 'redux/dataStore/svg/element';
import { defaultFillStyle } from 'redux/dataStore/svg/fill';
import { defaultStrokeStyle } from 'redux/dataStore/svg/stroke';

export const sampleRect: Omit<BaseElement, 'id'> = {
  containerId: 'svgCanvas',
  type: 'rect',
  stroke: defaultStrokeStyle,
  fill: defaultFillStyle,
  position: { x: 20, xOffset: 0, y: 20, yOffset: 0 },
  size: { x: 40, xOffset: 0, y: 30, yOffset: 0 },
};

export const sampleCircle: Omit<BaseElement, 'id'> = {
  containerId: 'svgCanvas',
  type: 'ellipse',
  stroke: defaultStrokeStyle,
  fill: { color: 'red' },
  position: { x: 50, xOffset: 0, y: 50, yOffset: 0 },
  size: { x: 40, xOffset: 0, y: 20, yOffset: 0 },
};

export const sampleLine: Omit<BaseElement, 'id'> = {
  containerId: 'svgCanvas',
  type: 'line',
  stroke: defaultStrokeStyle,
  position: { x: 0, xOffset: 0, y: 0, yOffset: 0 },
  size: { x: 50, xOffset: 0, y: 100, yOffset: 0 },
};
