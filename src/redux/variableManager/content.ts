import { BaseContent, GetAvailableContent, GetContent } from 'src/redux/content';
import { VariableManagerState } from './slice';

export const VARIABLE_MANAGER_CONTENT_TYPE = 'variableManager';

export interface VariableManagerContent extends BaseContent {
  type: typeof VARIABLE_MANAGER_CONTENT_TYPE;
}

export const getVariableManagerContent: GetContent<VariableManagerState> = ({ contentId, state }) => {
  const manager = state.managers[contentId];
  return {
    type: VARIABLE_MANAGER_CONTENT_TYPE,
    contentId: manager.id,
    label: manager.label,
  };
};

export const getAvailableVariableManagers: GetAvailableContent<VariableManagerState> = ({ state }) => {
  return Object.keys(state.managers).map((managerId) => {
    return getVariableManagerContent({ contentId: managerId, state });
  });
};
