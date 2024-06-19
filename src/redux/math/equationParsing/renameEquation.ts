import { Context } from '../context';
import { MathState } from '../mathSlice';

export interface RenameEquationProps {
  oldContext: Context;
  newContext: Context;
  state: MathState;
}

export default function changeEquationContext({ oldContext, newContext, state }: RenameEquationProps): void {
  if (oldContext.name !== newContext.name) {
    //renameEquation({ namespace: newContext.namespace, oldName: oldContext.name, newName: newContext.name, state });
  }
}

function renameEquation(): void {
  // TODO: implement
  return;
}
