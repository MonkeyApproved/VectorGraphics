import { AppStore, makeStore } from 'src/redux/store';
import { initialUiStates } from './test.helper';
import { changeTabAreaType } from '../slice';
import { QuadrantTabAreas, TwoHorizontalTabAreas, TwoVerticalTabAreas } from '../types';

describe('Changing tab area type', () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore({ ui: initialUiStates.singleAreaOneEach });
  });

  it('correctly rearranges tabs, when switching to "twoHorizontal"', () => {
    store.dispatch(changeTabAreaType({ type: 'twoHorizontal' }));
    const state = store.getState();
    const tabs = state.ui.tabs as TwoHorizontalTabAreas;

    expect(tabs.type).toEqual('twoHorizontal');
    expect(tabs.content.left).toHaveLength(3); // canvas1, var1, spreadsheet1
    expect(tabs.content.right).toHaveLength(1); // dataExplorer1
  });

  it('correctly rearranges tabs, when switching to "twoVertical"', () => {
    store.dispatch(changeTabAreaType({ type: 'twoVertical' }));
    const state = store.getState();
    const tabs = state.ui.tabs as TwoVerticalTabAreas;

    expect(tabs.type).toEqual('twoVertical');
    expect(tabs.content.top).toHaveLength(3); // canvas1, var1, dataExplorer1
    expect(tabs.content.bottom).toHaveLength(1); // spreadsheet1
  });

  it('does not change anything, when switching to "quadrant"', () => {
    store.dispatch(changeTabAreaType({ type: 'quadrant' }));
    const state = store.getState();
    const tabs = state.ui.tabs as QuadrantTabAreas;

    expect(tabs.type).toEqual('quadrant');
    expect(tabs.content.topLeft).toHaveLength(2); // canvas1, canvas1
    expect(tabs.content.topRight).toHaveLength(1); // dataExplorer1
    expect(tabs.content.bottomLeft).toHaveLength(1); // spreadsheet1
    expect(tabs.content.bottomRight).toHaveLength(0); // NONE
  });
});
