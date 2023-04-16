import { DataState } from '../dataSlice';
import { SELECTION_BOX_ID } from '../handlers/selectionBox';
import { applyArea } from './applyAttributes';
import { getMinimumAreaContainingAllElements } from './area';
import { selectElementById } from './element';

export function setSelectedElementList({ selectedElements, state }: { selectedElements: string[]; state: DataState }) {
  const elementSelection = selectElementById({ elementId: SELECTION_BOX_ID });

  if (selectedElements.length === 0) {
    elementSelection.remove();
    state.svg.selectedElementIds = [];
    return;
  }
  const selectionArea = getMinimumAreaContainingAllElements({ elementIds: selectedElements, state });
  applyArea({ area: selectionArea, type: 'rect', elementSelection });
  state.svg.selectedElementIds = selectedElements;
}
