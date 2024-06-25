import {
  Idle,
  MouseDragActive,
  MouseDragFinished,
  MouseEventTracker,
  BaseEvent,
  MouseDown,
  MOUSE_IDLE_EVENT_TYPE,
  MOUSE_DOWN_EVENT_TYPE,
  MOUSE_DRAG_ACTIVE_EVENT_TYPE,
  MOUSE_DRAG_FINISHED_EVENT_TYPE,
  MOUSE_CLICK_EVENT_TYPE,
  MouseClick,
} from 'src/Canvas/eventHandlers';
import { Canvas } from '../../canvas';
import { getNewShape } from '../../shape';
import { setShapeAttributes } from '../svgStateManagement/updateShape';
import { DRAW_ACTION_TYPE, DrawAction } from '../userAction';
import { DrawResponse, IDLE_ACTION_TYPE, IdleResponse, UIResponse } from '../uiResponse';
import { removeTempShapeFromCanvas, selectTempShape } from './tempShape';

export interface DrawTempShapeProps<T extends BaseEvent> {
  mouseTracker: T;
  canvas: Canvas<DrawAction>;
}

export default function drawSimpleShape({ canvas, mouseTracker }: DrawTempShapeProps<MouseEventTracker>): UIResponse {
  if (mouseTracker.type === MOUSE_IDLE_EVENT_TYPE) {
    // nothing to do
    return handleMouseIdle({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_DOWN_EVENT_TYPE) {
    // we first wait to see if this is going to be a click or a drag
    return handleMouseDown({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_DRAG_ACTIVE_EVENT_TYPE) {
    return handleMouseDragActive({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_DRAG_FINISHED_EVENT_TYPE) {
    return handleMouseDragFinished({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_CLICK_EVENT_TYPE) {
    return handleMouseClick({ mouseTracker, canvas });
  }
  throw new Error(`Unknown mouse event type ${(mouseTracker as MouseEventTracker).type}`);
}

function handleMouseIdle({ canvas }: DrawTempShapeProps<Idle>): IdleResponse {
  // nothing to do
  const shapeType = canvas.currentUserAction.shapeType;
  return { type: IDLE_ACTION_TYPE, statusMessage: `Start drawing ${shapeType}` };
}

function handleMouseDown({ canvas }: DrawTempShapeProps<MouseDown>): IdleResponse {
  // nothing to do
  const shapeType = canvas.currentUserAction.shapeType;
  return { type: IDLE_ACTION_TYPE, statusMessage: `Start drawing ${shapeType}` };
}

function handleMouseDragActive({ mouseTracker, canvas }: DrawTempShapeProps<MouseDragActive>): DrawResponse {
  const shapeType = canvas.currentUserAction.shapeType;
  const tempShapeSelection = selectTempShape({ canvas });
  const tempShape = getNewShape({
    shapeType,
    start: mouseTracker.start,
    end: mouseTracker.current,
  });
  setShapeAttributes({ shape: tempShape, selection: tempShapeSelection });
  return {
    type: DRAW_ACTION_TYPE,
    statusMessage: `drawing ${canvas.currentUserAction.shapeType}...`,
    tempShape,
    completed: false,
  };
}

function handleMouseDragFinished({ mouseTracker, canvas }: DrawTempShapeProps<MouseDragFinished>): DrawResponse {
  const shapeType = canvas.currentUserAction.shapeType;
  const tempShape = getNewShape({
    shapeType,
    start: mouseTracker.start,
    end: mouseTracker.end,
  });
  removeTempShapeFromCanvas();
  return {
    type: DRAW_ACTION_TYPE,
    statusMessage: `Drawing ${shapeType}...`,
    tempShape,
    completed: true,
    mouseTrackerUpdate: { type: MOUSE_IDLE_EVENT_TYPE },
  };
}

function handleMouseClick({ canvas }: DrawTempShapeProps<MouseClick>): IdleResponse {
  // nothing to do
  const shapeType = canvas.currentUserAction.shapeType;
  return {
    type: IDLE_ACTION_TYPE,
    statusMessage: `Start drawing ${shapeType}`,
    mouseTrackerUpdate: { type: MOUSE_IDLE_EVENT_TYPE },
  };
}
