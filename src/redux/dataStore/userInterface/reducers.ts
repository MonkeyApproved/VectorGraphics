import { mainTabReducers } from './tabs';
import { variableTableReducers } from './variableTable';

export const uiReducers = {
  ...mainTabReducers,
  ...variableTableReducers,
};
