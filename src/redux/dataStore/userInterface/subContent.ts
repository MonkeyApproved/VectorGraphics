export type SubContentTypes =
  | 'svgElement'
  | 'color'
  | 'stroke'
  | 'font'
  | 'alignElements'
  | 'addElement'
  | 'transformations';

export interface SubContent {
  id: string;
  containerId: string;
  type: SubContentTypes;
}
