import { SvgSettings } from '../settings';
import { BaseEntity } from '../types';
import { getFreshStats } from '../utils';

export interface Canvas extends BaseEntity {
  viewBox: string;
  elementIds: string[]; // can be elements or groups
  localSettings?: SvgSettings;
}

export function getEmptyCanvas({ label }: { label?: string }): Omit<Canvas, 'id'> {
  return {
    stats: getFreshStats(),
    label,
    viewBox: '0 0 0 0',
    elementIds: [],
  };
}
