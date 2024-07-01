import { ReactNode } from 'react';
import { DrawAction, MainUserActionTypes, PathSegmentTypes, SelectAction, UserAction } from 'src/redux/types';

export type SecondaryKey = 'Ctrl' | 'Shift' | 'Alt';

export interface MenuItem<T> {
  text: string;
  defaultOption?: boolean;
  shortcutKey: string;
  secondaryKey?: SecondaryKey;
  icon?: ReactNode;
  description?: string;
  status?: string;
  data: T;
}

export type MainMenuItem = MenuItem<MainUserActionTypes>;
export type SubMenuItem = MenuItem<UserAction>;
export type PathMenuItem = MenuItem<PathSegmentTypes | 'close' | 'end'>;

export const pathMenu: PathMenuItem[] = [
  { text: 'Line', data: 'line', shortcutKey: 'L', status: 'click to add line from last endpoint' },
  { text: 'Move', data: 'move', shortcutKey: 'M', status: 'click to jump to new position without connection' },
  {
    text: 'Curve',
    data: 'quadraticCurve',
    shortcutKey: 'C',
    status: '1st click: add control point; 2nd click: next endpoint',
  },
  { text: 'Close', data: 'close', shortcutKey: 'Z', status: 'close the path with line to start' },
  { text: 'End', data: 'end', shortcutKey: 'Esc', status: 'end the path, without closing it' },
];

export const drawShapeMenu: MenuItem<DrawAction>[] = [
  { text: 'Line', data: { type: 'drawShape', shapeType: 'line' }, shortcutKey: 'L', status: 'drag mouse to draw line' },
  {
    text: 'Rect',
    data: { type: 'drawShape', shapeType: 'rect' },
    shortcutKey: 'R',
    status: 'drag mouse to draw rectangle',
  },
  {
    text: 'Circ',
    data: { type: 'drawShape', shapeType: 'circle' },
    shortcutKey: 'C',
    status: 'drag mouse to draw circle',
  },
  {
    text: 'Elli',
    data: { type: 'drawShape', shapeType: 'ellipse' },
    shortcutKey: 'E',
    status: 'drag mouse to draw ellipse',
  },
  {
    text: 'Path',
    data: { type: 'drawShape', shapeType: 'path' },
    shortcutKey: 'P',
    status: 'click on canvas to set starting point of path',
  },
];

export const selectMenu: MenuItem<SelectAction>[] = [
  { text: 'Cli', data: { type: 'select', mode: 'click' }, shortcutKey: 'S', status: 'click on elements to select' },
  { text: 'RecA', data: { type: 'select', mode: 'rectAll' }, shortcutKey: 'A', status: 'drag mouse to select area' },
  {
    text: 'RecC',
    data: { type: 'select', mode: 'rectCenter' },
    shortcutKey: 'C',
    status: 'drag mouse to select area',
  },
];

export type MainMenuTexts = 'Draw' | 'Select';
export const mainMenu: MainMenuItem[] = [
  {
    text: 'Draw',
    data: 'drawShape',
    shortcutKey: 'D',
  },
  {
    text: 'Sel',
    data: 'select',
    shortcutKey: 'Space',
  },
  {
    text: 'Set',
    data: 'settings',
    shortcutKey: '.',
  },
];
