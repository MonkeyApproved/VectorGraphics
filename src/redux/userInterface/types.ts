import { Content } from './content';

/**
 * The position of a tab in a tab area.
 * Depending on the current tab area type, one or both of these properties might get ignored.
 * For example
 *   - in tab area "single", the position does not matter
 *   - in tab area "two-horizontal", only the horizontal position matters.
 */
export interface TabPosition {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right';
}

export type TabAreaType = 'single' | 'two-horizontal' | 'two-vertical' | 'quadrant';

export interface BaseTabArea {
  type: TabAreaType;
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
