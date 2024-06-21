import { ElementSelection } from './selectElement';

export function removeElement({ selection }: { selection: ElementSelection }): void {
  selection.remove();
}
