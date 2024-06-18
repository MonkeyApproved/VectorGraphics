export interface Element {
  id: string;
  shapeId: string;
  styleId: string;
  transformationId: string;
  children?: Element[];
}
