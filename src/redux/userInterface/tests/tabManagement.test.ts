import { AppStore, makeStore } from 'src/redux/store';
import { initialUiStates } from './test.helper';
import { changeTabAreaType } from '../uiSlice';
import { QuadrantTabAreas, TwoHorizontalTabAreas, TwoVerticalTabAreas } from '..';

describe('Changing tab area type', () => {
  let store: AppStore;

  beforeEach(() => {
    store = makeStore({ ui: initialUiStates.singleAreaOneEach });
  });

  it('correctly rearranges tabs, when switching to "two-horizontal"', () => {
    store.dispatch(changeTabAreaType({ type: 'two-horizontal' }));
    const state = store.getState();
    const tabs = state.ui.tabs as TwoHorizontalTabAreas;

    expect(tabs.type).toEqual('two-horizontal');
    expect(tabs.left).toHaveLength(3); // canvas1, var1, spreadsheet1
    expect(tabs.right).toHaveLength(1); // dataExplorer1
  });

  it('correctly rearranges tabs, when switching to "two-vertical"', () => {
    store.dispatch(changeTabAreaType({ type: 'two-vertical' }));
    const state = store.getState();
    const tabs = state.ui.tabs as TwoVerticalTabAreas;

    expect(tabs.type).toEqual('two-vertical');
    expect(tabs.top).toHaveLength(3); // canvas1, var1, dataExplorer1
    expect(tabs.bottom).toHaveLength(1); // spreadsheet1
  });

  it('does not change anything, when switching to "quadrant"', () => {
    store.dispatch(changeTabAreaType({ type: 'quadrant' }));
    const state = store.getState();
    const tabs = state.ui.tabs as QuadrantTabAreas;

    expect(tabs.type).toEqual('quadrant');
    expect(tabs.topLeft).toHaveLength(2); // canvas1, canvas1
    expect(tabs.topRight).toHaveLength(1); // dataExplorer1
    expect(tabs.bottomLeft).toHaveLength(1); // spreadsheet1
    expect(tabs.bottomRight).toHaveLength(0); // NONE
  });
});
