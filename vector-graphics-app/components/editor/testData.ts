import { Circle } from "../canvas/circle.helper";
import { ElementDict, generateId } from "../canvas/element.helper";
import { defaultFillStyle } from "../canvas/fill.helper";
import { Line } from "../canvas/line.helper";
import { Rect } from "../canvas/rect.helper";
import { defaultStrokeStyle } from "../canvas/stroke.helper";

export const rectId = generateId();
export const circleId = generateId();
export const lineId = generateId();

export const sampleRect: Rect = {
  id: rectId,
  type: "rect",
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

export const sampleCircle: Circle = {
  id: circleId,
  type: "circle",
  stroke: defaultStrokeStyle,
  fill: defaultFillStyle,
  position: {
    x: 50,
    y: 50,
  },
  radius: 40,
}

export const sampleLine: Line = {
  id: lineId,
  type: "line",
  stroke: defaultStrokeStyle,
  position: {x: 0, y: 0},
  start: {
    x: 10,
    y: 10,
  },
  end: {
    x: 50,
    y: 100,
  },
}

export const sampleElements: ElementDict = {
  circleId: sampleCircle,
  lineId: sampleLine,
  rectId: sampleRect,
};
