import { BaseContext } from 'src/redux/math';

export const VARIABLE_CONTEXT_TYPE = 'variable';
export const VARIABLE_NAMESPACE = 'variables';

export interface VariableContext extends BaseContext {
  type: typeof VARIABLE_CONTEXT_TYPE;
  namespace: typeof VARIABLE_NAMESPACE;
}

export function getVariableManagerContext({ name }: { name: string }): VariableContext {
  return {
    type: VARIABLE_CONTEXT_TYPE,
    namespace: VARIABLE_NAMESPACE,
    name,
  };
}
