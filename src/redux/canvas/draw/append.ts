import { ElementSelection } from './selection';

export function appendElement({
  parent,
  elementType,
}: {
  parent: ElementSelection;
  elementType: string;
}): ElementSelection {
  return parent.append(elementType);
}
