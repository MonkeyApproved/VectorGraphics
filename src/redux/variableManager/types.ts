import { Context } from 'src/redux/math';

export interface VariableManager {
  id: string;
  label: string;
  variables: Context[];
}