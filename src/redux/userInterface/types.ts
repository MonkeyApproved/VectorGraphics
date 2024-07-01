import { Content, ContentWithLabel } from './content';

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

export type TabAreaType = 'single' | 'twoHorizontal' | 'twoVertical' | 'quadrant';

export interface BaseTabArea {
  type: TabAreaType;
}

export type SingleTabAreaPosition = 'center';
export interface SingleTabArea {
  type: 'single';
  content: Record<SingleTabAreaPosition, Content[]>;
}

export type HorizontalTabAreaPosition = 'left' | 'right';
export interface TwoHorizontalTabAreas {
  type: 'twoHorizontal';
  content: Record<HorizontalTabAreaPosition, Content[]>;
}

export type VerticalTabAreaPosition = 'top' | 'bottom';
export interface TwoVerticalTabAreas {
  type: 'twoVertical';
  content: Record<VerticalTabAreaPosition, Content[]>;
}

export type QuadrantTabAreaPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export interface QuadrantTabAreas {
  type: 'quadrant';
  content: Record<QuadrantTabAreaPosition, Content[]>;
}

export type Tabs = SingleTabArea | TwoHorizontalTabAreas | TwoVerticalTabAreas | QuadrantTabAreas;

export interface TabAreaContent {
  content: ContentWithLabel[];
  selectedTab?: Content;
}
