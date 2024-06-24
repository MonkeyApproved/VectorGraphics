import * as d3 from 'd3';
import { RefObject, SetStateAction, Dispatch, useState, CSSProperties } from 'react';

export interface DividerProps {
  dragBorderRef: RefObject<HTMLDivElement>;
  setDividerPos: Dispatch<SetStateAction<number | undefined>>;
  setDragActive: Dispatch<SetStateAction<boolean>>;
  dimension: 'x' | 'y';
  id: string;
  className: string;
  style?: CSSProperties;
}

export default function Divider({
  dragBorderRef,
  setDividerPos,
  setDragActive,
  dimension,
  id,
  className,
  style,
}: DividerProps) {
  const dragCursor = dimension === 'x' ? 'ew-resize' : 'ns-resize';
  const [cursor, setCursor] = useState(dragCursor);
  // after an mouseDown event, we start listening for mouseMove and mouseUp events
  // within the drag border
  const dragStart = () => {
    setDragActive(true);
    setCursor('auto');
    dragBorderRef.current?.addEventListener('mousemove', dragging);
    dragBorderRef.current?.addEventListener('mouseleave', dragFinished);
    dragBorderRef.current?.addEventListener('mouseup', dragFinished);
  };
  // any mouse move inside the drag border will update the divider position
  // to it's current value (value is in pixels)
  const dragging = (event: MouseEvent) => {
    const position = d3.pointer(event, dragBorderRef.current);
    const value = dimension === 'x' ? position[0] : position[1];
    if (dimension === 'x') {
      setDividerPos(value);
    } else {
      setDividerPos(value);
    }
    // avoid text and element selection
    event.preventDefault();
    event.stopPropagation();
  };
  // finally, whenever the mouse up or  leave event is triggered,
  // we stop the drag by removing the event listeners
  const dragFinished = () => {
    setDragActive(false);
    setCursor(dragCursor);
    dragBorderRef.current?.removeEventListener('mousemove', dragging);
    dragBorderRef.current?.removeEventListener('mouseleave', dragFinished);
    dragBorderRef.current?.removeEventListener('mouseup', dragFinished);
  };

  return <div className={className} style={{ ...style, cursor }} onMouseDown={dragStart} id={id} />;
}
