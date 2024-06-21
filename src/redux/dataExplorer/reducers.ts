import { getDataExplorerId } from './id';
import { getEmptyExplorer } from './explorer';
import { DataExplorerSliceReducer } from './slice';

const addDataExplorer: DataExplorerSliceReducer<{ label?: string }> = (state, { payload }) => {
  const managerId = getDataExplorerId({ state });
  state.dataSets[managerId] = { ...getEmptyExplorer({ label: payload.label }), id: managerId };
};

const removeDataExplorer: DataExplorerSliceReducer<{ managerId: string }> = (state, { payload }) => {
  // get the canvas to remove
  const canvas = state.dataSets[payload.managerId];
  if (!canvas) {
    throw new Error(`DataExplorer with id ${payload.managerId} not found`);
  }

  // remove the canvas
  delete state.dataSets[payload.managerId];
};

export const reducers = { addDataExplorer, removeDataExplorer };
