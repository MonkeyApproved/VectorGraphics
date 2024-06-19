import { Context } from 'src/redux/math';

export interface VariableManager {
  id: string;
  label?: string;
  variables: string[];
}

export function getEmptyManager({ label }: { label?: string }): Omit<VariableManager, 'id'> {
  return {
    label,
    variables: [],
  };
}
