export type ElementTypes = 'group' | 'line' | 'rect' | 'ellipse' | 'path' | 'circle' | 'polygon';

export interface BaseElement {
  id: string;
  type: ElementTypes;
  // dependencies
  containerId: string;
  children?: string[];
  // positioning
  position: Position;
  size: Size;
  path: string;
  transformations?: Transformation[];
  // styling
  stroke?: Stroke;
  fill?: Fill;
}
