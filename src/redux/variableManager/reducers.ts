import { getVariableManagerId } from './id';
import { getEmptyManager } from './manager';
import { VariableManagerSliceReducer } from './slice';

const addVariableManager: VariableManagerSliceReducer<{ label?: string }> = (state, { payload }) => {
  const managerId = getVariableManagerId({ state });
  state.managers[managerId] = { ...getEmptyManager({ label: payload.label }), id: managerId };
};

const removeVariableManager: VariableManagerSliceReducer<{ managerId: string }> = (state, { payload }) => {
  // get the canvas to remove
  const canvas = state.managers[payload.managerId];
  if (!canvas) {
    throw new Error(`VariableManager with id ${payload.managerId} not found`);
  }

  // remove the canvas
  delete state.managers[payload.managerId];
};

const addVariableToVariableManager: VariableManagerSliceReducer<{ managerId: string; variableName: string }> = (
  state,
  { payload },
) => {
  // get the manager to add the equation to
  const manager = state.managers[payload.managerId];
  if (!manager) {
    throw new Error(`VariableManager with id ${payload.managerId} not found`);
  }

  // add new variable context to the manager
  manager.variables.push(payload.variableName);
};

const removeVariableFromVariableManager: VariableManagerSliceReducer<{ managerId: string; variableName: string }> = (
  state,
  { payload },
) => {
  // get the manager to remove the equation to
  const manager = state.managers[payload.managerId];
  if (!manager) {
    throw new Error(`VariableManager with id ${payload.managerId} not found`);
  }

  // find the variable in the manager
  const index = manager.variables.findIndex((v) => v === payload.variableName);
  if (index === -1) {
    throw new Error(`Variable context ${payload.variableName} not found in manager ${payload.managerId}`);
  }

  // remove the variable context
  manager.variables.splice(index, 1);
};

export const reducers = {
  // managers
  addVariableManager,
  removeVariableManager,
  // variables
  addVariableToVariableManager,
  removeVariableFromVariableManager,
};
