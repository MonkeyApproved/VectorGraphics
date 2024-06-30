import { getHighlightedElementStyle, getMinimalRectContainingElements, useAppSelector } from 'src/redux/selectors';
import { Rect } from 'src/redux/types';
import SelectionRect from './SelectionRect';
import Element from 'src/Canvas/Element';
import { NewShapeGeneric } from 'src/redux/canvas/shape';

export interface SelectedElementsProps {
  selectedElements: string[];
  canvasId: string;
  showMinimalRect: boolean;
  selectionRect?: NewShapeGeneric<Rect>;
}

export default function SelectedElements({
  selectedElements,
  canvasId,
  showMinimalRect,
  selectionRect,
}: SelectedElementsProps) {
  // all elements contained in the selection rect are highlighted with a specific style
  const highlightStyle = useAppSelector((state) => getHighlightedElementStyle(state, canvasId));
  const highlightedElements = selectedElements.map((elementId) => (
    <Element key={`highlight-${elementId}`} elementId={elementId} canvasId={canvasId} overwriteStyle={highlightStyle} />
  ));

  // shows the size of the final selection area, containing all selected elements
  const finalRect = showMinimalRect ? (
    <SelectionRect
      rect={useAppSelector((state) => getMinimalRectContainingElements(state, selectedElements))}
      canvasId={canvasId}
    />
  ) : null;

  // shows the current selection rectangle. This is only visible while the user is dragging the mouse
  const tempRect = selectionRect ? <SelectionRect rect={selectionRect} canvasId={canvasId} /> : null;

  return (
    <>
      {highlightedElements}
      {finalRect}
      {tempRect}
    </>
  );
}
