import { Content } from './content';

export interface BaseTabArea {
  type: 'single' | 'two-horizontal' | 'two-vertical' | 'quadrant';
}

export interface SingleTabArea {
  type: 'single';
  tabs: Content[];
}

export interface TwoHorizontalTabAreas {
  type: 'two-horizontal';
  left: Content[];
  right: Content[];
}

export interface TwoVerticalTabAreas {
  type: 'two-vertical';
  top: Content[];
  bottom: Content[];
}

export interface QuadrantTabAreas {
  type: 'quadrant';
  topLeft: Content[];
  topRight: Content[];
  bottomLeft: Content[];
  bottomRight: Content[];
}

export type Tabs = SingleTabArea | TwoHorizontalTabAreas | TwoVerticalTabAreas | QuadrantTabAreas;
