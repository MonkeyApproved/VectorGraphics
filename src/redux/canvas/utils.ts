import { Stats } from './types';

export function getFreshStats(): Stats {
  return { usages: 1, version: 0 };
}
