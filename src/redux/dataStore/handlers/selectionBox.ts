import { DataState } from '../dataSlice';
import { CoordinatePixels } from '../svg/coordinate';
import { getAllElementsWithinArea, getAreaContainingCoordinates } from '../svg/area';
import { appendElementToContainer, BaseElement, drawElement, ElementTypes, selectElementById } from '../svg/element';
import { SvgTool } from '../svg/settings';
import { setSelectedElementList } from '../svg/elementSelection';
import { applyArea, applyFill, applyId, applyStroke } from '../svg/applyAttributes';
import { addNewElement } from '../svg/elementDict';

export const SELECTION_BOX_ID = 'selectionBox';

function getElementType({ tool }: { tool: SvgTool }): ElementTypes {
  switch (tool) {
    case 'select':
    case 'addRect':
      return 'rect';
    case 'addLine':
      return 'line';
    case 'addEllipse':
      return 'ellipse';
    default:
      throw new Error('Unknown tool type');
  }
}

export function updateSelectionBoxDuringDrag({
  state,
  currentMousePosition,
}: {
  state: DataState;
  currentMousePosition: CoordinatePixels;
}) {
  const type = getElementType({ tool: state.svg.settings.activeTool });
  const isSelectTool = state.svg.settings.activeTool === 'select';
  const initialPosition = state.mouseEvent.initialMousePosition;
  if (!initialPosition) throw new Error('Drag handler called without initial position being set');
  if (!state.svg.bottomCanvasId) throw new Error('Drag handler called without bottom canvas id set');
  let elementSelection = selectElementById({ elementId: SELECTION_BOX_ID });
  if (elementSelection.empty()) {
    // the selection box was not added yet -> draw the element
    const style = isSelectTool ? state.svg.settings.selectionBoxStyle : state.svg.settings.defaultElementStyle;
    elementSelection = appendElementToContainer({ elementType: type, containerId: state.svg.bottomCanvasId });
    applyStroke({ elementSelection, stroke: style.stroke });
    applyFill({ elementSelection, fill: style.fill });
    applyId({ id: SELECTION_BOX_ID, elementSelection });
  }

  // get selection area and apply result to rect
  const area = getAreaContainingCoordinates({ coordinateList: [currentMousePosition, initialPosition] });
  applyArea({ area, type, elementSelection });
}

export function completeSelectionBoxOnMouseUp({
  state,
  currentMousePosition,
}: {
  state: DataState;
  currentMousePosition: CoordinatePixels;
}) {
  // get selection box element and it's area
  const initialPosition = state.mouseEvent.initialMousePosition;
  if (!initialPosition) throw new Error('Drag handler called without initial position being set');
  const elementSelection = selectElementById({ elementId: SELECTION_BOX_ID });
  const area = getAreaContainingCoordinates({ coordinateList: [currentMousePosition, initialPosition] });

  // CASE A: user was using the selection tool to select elements on the main canvas
  if (state.svg.settings.activeTool === 'select') {
    // 1. get all elements that are full contained within the selection area
    const selectedElements = getAllElementsWithinArea({ area, state });
    // 2. update selected elements and redraw selection box
    setSelectedElementList({ selectedElements, state });
    return;
  }
  // CASE B: user was drawing a new element -> construct new base element and add it to main canvas and element dict
  // 1. remove element from bottom canvas (after drawing finishes, elements are moved to the main canvas)
  elementSelection.remove();

  // 2. get all required parameters of the element
  if (!state.svg.canvasId) throw new Error('Canvas id required to add new element');
  const type = getElementType({ tool: state.svg.settings.activeTool });

  // 3. add element to the main canvas and the elementDict
  const baseElementPixels: Omit<BaseElement, 'id'> = {
    containerId: state.svg.canvasId,
    type,
    position: { ...area.position, xOffset: 0, yOffset: 0 },
    size: { ...area.size, xOffset: 0, yOffset: 0 },
    ...state.svg.settings.defaultElementStyle,
  };
  const baseElement = addNewElement({ state, element: baseElementPixels });
  drawElement({ element: baseElement, containerId: state.svg.canvasId, state });
}
