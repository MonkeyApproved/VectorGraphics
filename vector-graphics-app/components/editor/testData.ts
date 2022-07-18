import { defaultCircleStyle } from "../canvas/circle.helper";
import { Element } from "../canvas/group.helper";
import { defaultLineStyle } from "../canvas/line.helper";
import { defaultRectStyle } from "../canvas/rect.helper";


export const simpleElements: Element[] = [
    {
      type: 'circle',
      style: defaultCircleStyle,
      x: 50,
      y: 20,
      r: 40,
    },
    {
      type: 'line',
      style: defaultLineStyle,
      x1: 10,
      y1: 10,
      x2: 90,
      y2: 90,
      z: 1,
    },
    {
      type: 'line',
      style: defaultLineStyle,
      x1: 0,
      y1: 0,
      x2: 5,
      y2: 30,
      z: 1,
    },
    {
      type: 'rect',
      style: defaultRectStyle,
      x: 20,
      y: 20,
      width: 40,
      height: 30,
    }
  ]