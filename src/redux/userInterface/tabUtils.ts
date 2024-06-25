import { Content } from './content';
import {
  QuadrantTabAreas,
  SingleTabArea,
  TabAreaType,
  TabPosition,
  Tabs,
  TwoHorizontalTabAreas,
  TwoVerticalTabAreas,
} from './types';

interface ManageContentProps<T> {
  content: Content;
  tabs: T;
}

interface MoveContentProps extends ManageContentProps<Tabs> {
  newPosition: TabPosition;
}

export function moveContent({ content, newPosition, tabs }: MoveContentProps) {
  // first remove the content from the current position
  removeContent({ content, tabs });
  // then modify the content's position
  content.position = newPosition;
  // lastly, place the content in the new position
  placeContent({ content: { ...content, position: newPosition }, tabs });
}

export function placeContent({ content, tabs }: ManageContentProps<Tabs>) {
  switch (tabs.type) {
    case 'single':
      return placeContentInSingleTabArea({ content, tabs });
    case 'twoHorizontal':
      return placeContentInTwoHorizontalTabAreas({ content, tabs });
    case 'twoVertical':
      return placeContentInTwoVerticalTabAreas({ content, tabs });
    case 'quadrant':
      return placeContentInQuadrantTabAreas({ content, tabs });
    default:
      throw new Error(`Invalid tab type: ${(tabs as Tabs).type}`);
  }
}

export function placeContentInSingleTabArea({ content, tabs }: ManageContentProps<SingleTabArea>) {
  tabs.content.center.push(content);
}

export function placeContentInTwoHorizontalTabAreas({ content, tabs }: ManageContentProps<TwoHorizontalTabAreas>) {
  if (content.position.horizontal === 'left') {
    tabs.content.left.push(content);
  } else if (content.position.horizontal === 'right') {
    tabs.content.right.push(content);
  } else {
    throw new Error(`Invalid horizontal position: ${content.position.horizontal}`);
  }
}

export function placeContentInTwoVerticalTabAreas({ content, tabs }: ManageContentProps<TwoVerticalTabAreas>) {
  if (content.position.vertical === 'top') {
    tabs.content.top.push(content);
  } else if (content.position.vertical === 'bottom') {
    tabs.content.bottom.push(content);
  } else {
    throw new Error(`Invalid vertical position: ${content.position.vertical}`);
  }
}

export function placeContentInQuadrantTabAreas({ content, tabs }: ManageContentProps<QuadrantTabAreas>) {
  if (content.position.vertical === 'top' && content.position.horizontal === 'left') {
    tabs.content.topLeft.push(content);
  } else if (content.position.vertical === 'top' && content.position.horizontal === 'right') {
    tabs.content.topRight.push(content);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'left') {
    tabs.content.bottomLeft.push(content);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'right') {
    tabs.content.bottomRight.push(content);
  } else {
    throw new Error(`Invalid position: ${content.position.horizontal}, ${content.position.vertical}`);
  }
}

export const removeContent = ({ content, tabs }: ManageContentProps<Tabs>) => {
  switch (tabs.type) {
    case 'single':
      return removeContentInSingleTabArea({ content, tabs });
    case 'twoHorizontal':
      return removeContentInTwoHorizontalTabAreas({ content, tabs });
    case 'twoVertical':
      return removeContentInTwoVerticalTabAreas({ content, tabs });
    case 'quadrant':
      return removeContentInQuadrantTabAreas({ content, tabs });
    default:
      throw new Error(`Invalid tab type: ${(tabs as Tabs).type}`);
  }
};

export const removeContentInSingleTabArea = ({ content, tabs }: ManageContentProps<SingleTabArea>) => {
  tabs.content.center = tabs.content.center.filter((c) => c.tabId !== content.tabId);
};

export const removeContentInTwoHorizontalTabAreas = ({ content, tabs }: ManageContentProps<TwoHorizontalTabAreas>) => {
  if (content.position.horizontal === 'left') {
    tabs.content.left = tabs.content.left.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.horizontal === 'right') {
    tabs.content.right = tabs.content.right.filter((c) => c.tabId !== content.tabId);
  }
};

export const removeContentInTwoVerticalTabAreas = ({ content, tabs }: ManageContentProps<TwoVerticalTabAreas>) => {
  if (content.position.vertical === 'top') {
    tabs.content.top = tabs.content.top.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'bottom') {
    tabs.content.bottom = tabs.content.bottom.filter((c) => c.tabId !== content.tabId);
  }
};

export const removeContentInQuadrantTabAreas = ({ content, tabs }: ManageContentProps<QuadrantTabAreas>) => {
  if (content.position.vertical === 'top' && content.position.horizontal === 'left') {
    tabs.content.topLeft = tabs.content.topLeft.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'top' && content.position.horizontal === 'right') {
    tabs.content.topRight = tabs.content.topRight.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'left') {
    tabs.content.bottomLeft = tabs.content.bottomLeft.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'right') {
    tabs.content.bottomRight = tabs.content.bottomRight.filter((c) => c.tabId !== content.tabId);
  }
};

export function getContentList({ position, tabs }: { position: TabPosition; tabs: Tabs }): Content[] {
  switch (tabs.type) {
    case 'single':
      return tabs.content.center;
    case 'twoHorizontal':
      return position.horizontal === 'left' ? tabs.content.left : tabs.content.right;
    case 'twoVertical':
      return position.vertical === 'top' ? tabs.content.top : tabs.content.bottom;
    case 'quadrant':
      if (position.vertical === 'top' && position.horizontal === 'left') {
        return tabs.content.topLeft;
      } else if (position.vertical === 'top' && position.horizontal === 'right') {
        return tabs.content.topRight;
      } else if (position.vertical === 'bottom' && position.horizontal === 'left') {
        return tabs.content.bottomLeft;
      } else if (position.vertical === 'bottom' && position.horizontal === 'right') {
        return tabs.content.bottomRight;
      }
  }
  throw new Error(`Invalid tab type: ${(tabs as Tabs).type}`);
}

export function getAllContent({ tabs }: { tabs: Tabs }): Content[] {
  switch (tabs.type) {
    case 'single':
      return tabs.content.center;
    case 'twoHorizontal':
      return tabs.content.left.concat(tabs.content.right);
    case 'twoVertical':
      return tabs.content.top.concat(tabs.content.bottom);
    case 'quadrant':
      return tabs.content.topLeft.concat(tabs.content.topRight, tabs.content.bottomLeft, tabs.content.bottomRight);
  }
}

export function getEmptyTabs({ type }: { type: TabAreaType }): Tabs {
  switch (type) {
    case 'single':
      return { type, content: { center: [] } };
    case 'twoHorizontal':
      return { type, content: { left: [], right: [] } };
    case 'twoVertical':
      return { type, content: { top: [], bottom: [] } };
    case 'quadrant':
      return { type, content: { topLeft: [], topRight: [], bottomLeft: [], bottomRight: [] } };
  }
}
