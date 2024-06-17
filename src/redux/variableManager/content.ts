import { BaseContent } from 'src/redux/userInterface';

export const VARIABLE_MANAGER_CONTENT_TYPE = 'variableManager';

export interface VariableManagerContent extends BaseContent {
  type: typeof VARIABLE_MANAGER_CONTENT_TYPE;
}
