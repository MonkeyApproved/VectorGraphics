import { TabAreaType, TabPosition } from './types';
import { Content, ContentType } from './content';
import { UiSliceReducer } from './slice';
import { getAllContent, getEmptyTabs, moveContent, placeContent, removeContent } from './tabUtils';
import { getTabId } from './id';

/**
 * Adds a new tab to the selected tab area.
 *
 * @param {Object} payload - The payload for the action
 * @param {ContentType} payload.type - The type of the content to add (e.g. canvas, spreadsheet, etc.)
 * @param {string} payload.contentId - The id of the content to add (e.g. canvasId, spreadsheetId, etc.)
 * @param {TabPosition} payload.position - The position of the tab in the tab area (optional, default is top-left)
 * @param {string} payload.label - The label of the tab (optional)
 */
const addNewTab: UiSliceReducer<{ type: ContentType; contentId: string; position?: TabPosition }> = (
  state,
  { payload },
) => {
  // get the new tab (canvas, spreadsheet, etc.)
  const newTab: Content = {
    tabId: getTabId({ state }),
    type: payload.type,
    position: payload.position || { vertical: 'top', horizontal: 'left' },
    contentId: payload.contentId,
  };

  // add tab to correct tab-area
  placeContent({ content: newTab, tabs: state.tabs });
};

/**
 * Removes a tab from the tab area it is currently in.
 *
 * @param {Object} payload - The payload for the action
 * @param {Content} payload.content - The content to remove
 */
const removeTab: UiSliceReducer<{ content: Content }> = (state, { payload }) => {
  removeContent({ content: payload.content, tabs: state.tabs });
};

/**
 * Move an existing tab to a different tab area.
 * The tab will be removed from the current tab area and placed in the new tab area.
 *
 * @param {Object} payload - The payload for the action
 * @param {Content} payload.content - The content to move to a different tab area
 * @param {TabPosition} payload.newPosition - The tab area to move the content to
 */
const moveTab: UiSliceReducer<{ content: Content; newPosition: TabPosition }> = (state, { payload }) => {
  moveContent({ ...payload, tabs: state.tabs });
};

const changeTabAreaType: UiSliceReducer<{ type: TabAreaType }> = (state, { payload }) => {
  // check if tab area is different from current type
  if (state.tabs.type === payload.type) {
    return;
  }

  // new tab area of selected type and place all current tabs in it
  const newTabs = getEmptyTabs({ type: payload.type });
  const currentTabs = getAllContent({ tabs: state.tabs });
  currentTabs.forEach((tab) => placeContent({ content: tab, tabs: newTabs }));

  // update the store with the new tab area
  state.tabs = newTabs;
};

export const reducers = { addNewTab, removeTab, moveTab, changeTabAreaType };
