export interface ComponentCounter {
  shapes: { [key: string]: number };
  styles: number;
  transformations: number;
  elements: number;
  groups: number;
  canvases: number;
}

export const initialCounterState: ComponentCounter = {
  shapes: {
    line: 0,
    rect: 0,
    circle: 0,
    ellipse: 0,
    path: 0,
    polygon: 0,
    polyline: 0,
  },
  styles: 0,
  transformations: 0,
  elements: 0,
  groups: 0,
  canvases: 1,
};
