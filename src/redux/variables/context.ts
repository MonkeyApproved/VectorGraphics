import { BaseContext } from '../math';

export const VARIABLE_CONTEXT_TYPE = 'variable';
export const VARIABLE_NAMESPACE = 'variables';

export interface VariableContext extends BaseContext {
  type: typeof VARIABLE_CONTEXT_TYPE;
  namespace: typeof VARIABLE_NAMESPACE;
}
