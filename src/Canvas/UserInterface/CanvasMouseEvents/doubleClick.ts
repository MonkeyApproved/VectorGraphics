import { Coordinate } from 'src/redux/types';
import { pointDistance } from 'src/redux/utils';

const MAX_DOUBLE_CLICK_DISTANCE = 10;
const MAX_DOUBLE_CLICK_TIME = 500;

export interface ClickEvent {
  position: Coordinate;
  time: number;
}

export function checkDoubleClick({ mouseClicks }: { mouseClicks: ClickEvent[] }): boolean {
  const last = mouseClicks.at(-1);
  const secondLast = mouseClicks.at(-2);
  if (!last || !secondLast) {
    // there are less than two recorded clicks: this cannot be a double click
    return false;
  }
  const timeSinceLastClick = secondLast.time - last.time;
  const distance = pointDistance({ leftArg: last.position, rightArg: secondLast.position });
  return timeSinceLastClick < MAX_DOUBLE_CLICK_TIME && distance < MAX_DOUBLE_CLICK_DISTANCE;
}
