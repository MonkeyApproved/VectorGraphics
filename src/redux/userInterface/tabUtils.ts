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
    case 'two-horizontal':
      return placeContentInTwoHorizontalTabAreas({ content, tabs });
    case 'two-vertical':
      return placeContentInTwoVerticalTabAreas({ content, tabs });
    case 'quadrant':
      return placeContentInQuadrantTabAreas({ content, tabs });
    default:
      throw new Error(`Invalid tab type: ${(tabs as Tabs).type}`);
  }
}

export function placeContentInSingleTabArea({ content, tabs }: ManageContentProps<SingleTabArea>) {
  tabs.tabs.push(content);
}

export function placeContentInTwoHorizontalTabAreas({ content, tabs }: ManageContentProps<TwoHorizontalTabAreas>) {
  if (content.position.horizontal === 'left') {
    tabs.left.push(content);
  } else if (content.position.horizontal === 'right') {
    tabs.right.push(content);
  } else {
    throw new Error(`Invalid horizontal position: ${content.position.horizontal}`);
  }
}

export function placeContentInTwoVerticalTabAreas({ content, tabs }: ManageContentProps<TwoVerticalTabAreas>) {
  if (content.position.vertical === 'top') {
    tabs.top.push(content);
  } else if (content.position.vertical === 'bottom') {
    tabs.bottom.push(content);
  } else {
    throw new Error(`Invalid vertical position: ${content.position.vertical}`);
  }
}

export function placeContentInQuadrantTabAreas({ content, tabs }: ManageContentProps<QuadrantTabAreas>) {
  if (content.position.vertical === 'top' && content.position.horizontal === 'left') {
    tabs.topLeft.push(content);
  } else if (content.position.vertical === 'top' && content.position.horizontal === 'right') {
    tabs.topRight.push(content);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'left') {
    tabs.bottomLeft.push(content);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'right') {
    tabs.bottomRight.push(content);
  } else {
    throw new Error(`Invalid position: ${content.position.horizontal}, ${content.position.vertical}`);
  }
}

export const removeContent = ({ content, tabs }: ManageContentProps<Tabs>) => {
  switch (tabs.type) {
    case 'single':
      return removeContentInSingleTabArea({ content, tabs });
    case 'two-horizontal':
      return removeContentInTwoHorizontalTabAreas({ content, tabs });
    case 'two-vertical':
      return removeContentInTwoVerticalTabAreas({ content, tabs });
    case 'quadrant':
      return removeContentInQuadrantTabAreas({ content, tabs });
    default:
      throw new Error(`Invalid tab type: ${(tabs as Tabs).type}`);
  }
};

export const removeContentInSingleTabArea = ({ content, tabs }: ManageContentProps<SingleTabArea>) => {
  tabs.tabs = tabs.tabs.filter((c) => c.tabId !== content.tabId);
};

export const removeContentInTwoHorizontalTabAreas = ({ content, tabs }: ManageContentProps<TwoHorizontalTabAreas>) => {
  if (content.position.horizontal === 'left') {
    tabs.left = tabs.left.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.horizontal === 'right') {
    tabs.right = tabs.right.filter((c) => c.tabId !== content.tabId);
  }
};

export const removeContentInTwoVerticalTabAreas = ({ content, tabs }: ManageContentProps<TwoVerticalTabAreas>) => {
  if (content.position.vertical === 'top') {
    tabs.top = tabs.top.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'bottom') {
    tabs.bottom = tabs.bottom.filter((c) => c.tabId !== content.tabId);
  }
};

export const removeContentInQuadrantTabAreas = ({ content, tabs }: ManageContentProps<QuadrantTabAreas>) => {
  if (content.position.vertical === 'top' && content.position.horizontal === 'left') {
    tabs.topLeft = tabs.topLeft.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'top' && content.position.horizontal === 'right') {
    tabs.topRight = tabs.topRight.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'left') {
    tabs.bottomLeft = tabs.bottomLeft.filter((c) => c.tabId !== content.tabId);
  } else if (content.position.vertical === 'bottom' && content.position.horizontal === 'right') {
    tabs.bottomRight = tabs.bottomRight.filter((c) => c.tabId !== content.tabId);
  }
};

export function getContentList({ position, tabs }: { position: TabPosition; tabs: Tabs }): Content[] {
  switch (tabs.type) {
    case 'single':
      return tabs.tabs;
    case 'two-horizontal':
      return position.horizontal === 'left' ? tabs.left : tabs.right;
    case 'two-vertical':
      return position.vertical === 'top' ? tabs.top : tabs.bottom;
    case 'quadrant':
      if (position.vertical === 'top' && position.horizontal === 'left') {
        return tabs.topLeft;
      } else if (position.vertical === 'top' && position.horizontal === 'right') {
        return tabs.topRight;
      } else if (position.vertical === 'bottom' && position.horizontal === 'left') {
        return tabs.bottomLeft;
      } else if (position.vertical === 'bottom' && position.horizontal === 'right') {
        return tabs.bottomRight;
      }
  }
  throw new Error(`Invalid tab type: ${(tabs as Tabs).type}`);
}

export function getAllContent({ tabs }: { tabs: Tabs }): Content[] {
  switch (tabs.type) {
    case 'single':
      return tabs.tabs;
    case 'two-horizontal':
      return tabs.left.concat(tabs.right);
    case 'two-vertical':
      return tabs.top.concat(tabs.bottom);
    case 'quadrant':
      return tabs.topLeft.concat(tabs.topRight, tabs.bottomLeft, tabs.bottomRight);
  }
}

export function getEmptyTabs({ type }: { type: TabAreaType }): Tabs {
  switch (type) {
    case 'single':
      return { type, tabs: [] };
    case 'two-horizontal':
      return { type, left: [], right: [] };
    case 'two-vertical':
      return { type, top: [], bottom: [] };
    case 'quadrant':
      return { type, topLeft: [], topRight: [], bottomLeft: [], bottomRight: [] };
  }
}
