import { DOMAttributes, ReactNode } from 'react';
import { getCanvasElementIds, getHighlightedElementStyle, useAppSelector } from 'src/redux/selectors';
import { ReactMouseEvent } from '../../types';
import Element from './Element';

export interface SelectedElementsProps {
  selectedElements: string[];
  hiddenElements?: string[];
  canvasId: string;
  onMouseDownElement?: (event: ReactMouseEvent, elementId: string) => void;
}

export default function Elements({
  selectedElements,
  hiddenElements = [],
  canvasId,
  onMouseDownElement,
}: SelectedElementsProps): ReactNode {
  // current redux state
  const allElements = useAppSelector((state) => getCanvasElementIds(state, canvasId));
  // all elements contained in the selection rect are highlighted with a specific style
  const highlightStyle = useAppSelector((state) => getHighlightedElementStyle(state, canvasId));

  // get all elements (selected ones are highlighted, all others are shown normally)
  return allElements.map((elementId) => {
    const isHighlighted = selectedElements.includes(elementId);
    const isHidden = hiddenElements.includes(elementId);
    const elementProps: DOMAttributes<SVGElement> = {};
    if (onMouseDownElement) {
      elementProps['onMouseDown'] = (event: ReactMouseEvent) => onMouseDownElement(event, elementId);
    }
    if (isHidden) {
      return null;
    } else if (isHighlighted) {
      return (
        <Element
          key={`highlight-${elementId}`}
          elementId={elementId}
          canvasId={canvasId}
          overwriteStyle={highlightStyle}
          elementProps={elementProps}
          style={{ cursor: 'pointer' }}
        />
      );
    } else {
      return (
        <Element
          key={`notHighlight-${elementId}`}
          elementId={elementId}
          canvasId={canvasId}
          elementProps={elementProps}
          style={{ cursor: 'pointer' }}
        />
      );
    }
  });
}
