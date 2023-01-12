import { BaseElementPixels } from 'redux/dataStore/svg/element';
import { defaultFillStyle } from 'redux/dataStore/svg/fill';
import { defaultStrokeStyle } from 'redux/dataStore/svg/stroke';

export const sampleRect: BaseElementPixels = {
  containerId: 'svgCanvas',
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

export const sampleCircle: BaseElementPixels = {
  containerId: 'svgCanvas',
  type: 'ellipse',
  stroke: defaultStrokeStyle,
  fill: {
    color: 'red',
  },
  position: { x: 50, y: 50 },
  size: { x: 40, y: 20 },
};

export const sampleLine: BaseElementPixels = {
  containerId: 'svgCanvas',
  type: 'line',
  stroke: defaultStrokeStyle,
  position: { x: 0, y: 0 },
  size: { x: 50, y: 100 },
};
