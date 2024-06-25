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
import { appendFinishedSegments, removeTempShapeFromCanvas, selectTempShape } from './tempShape';
import { pointDistance } from '../../coordinateMath';

export interface DrawTempShapeProps<T extends BaseEvent> {
  mouseTracker: T;
  canvas: Canvas<DrawAction>;
}

export default function drawPointShape({ canvas, mouseTracker }: DrawTempShapeProps<MouseEventTracker>): UIResponse {
  if (mouseTracker.type === MOUSE_IDLE_EVENT_TYPE) {
    // nothing to do
    return handleMouseIdle({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_DOWN_EVENT_TYPE) {
    return handleMouseDown({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_DRAG_ACTIVE_EVENT_TYPE) {
    return handleMouseDragActive({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_DRAG_FINISHED_EVENT_TYPE) {
    return respondWithNewFinishedSegmentAdded({ mouseTracker, canvas });
  } else if (mouseTracker.type === MOUSE_CLICK_EVENT_TYPE) {
    return respondWithNewFinishedSegmentAdded({ mouseTracker, canvas });
  }
  throw new Error(`Unknown mouse event type ${(mouseTracker as MouseEventTracker).type}`);
}

function handleMouseIdle({ canvas }: DrawTempShapeProps<Idle>): IdleResponse {
  // nothing to do
  const shapeType = canvas.currentUserAction.shapeType;
  return { type: IDLE_ACTION_TYPE, statusMessage: `Start drawing ${shapeType}` };
}

function handleMouseDown({ canvas, mouseTracker }: DrawTempShapeProps<MouseDown>): DrawResponse | IdleResponse {
  const shapeType = canvas.currentUserAction.shapeType;
  if (mouseTracker.finishedSegments) {
    const tempShape = appendFinishedSegments({
      finishedSegments: mouseTracker.finishedSegments,
      current: mouseTracker.start,
    });
    return {
      type: DRAW_ACTION_TYPE,
      tempShape,
      statusMessage: `Drawing ${shapeType}...`,
    };
  } else {
    return { type: IDLE_ACTION_TYPE, statusMessage: `Start drawing ${shapeType}` };
  }
}

function handleMouseDragActive({ mouseTracker, canvas }: DrawTempShapeProps<MouseDragActive>): DrawResponse {
  const shapeType = canvas.currentUserAction.shapeType;
  const tempShapeSelection = selectTempShape({ canvas });
  const tempShape = mouseTracker.finishedSegments
    ? appendFinishedSegments({ finishedSegments: mouseTracker.finishedSegments, current: mouseTracker.current })
    : getNewShape({
        shapeType,
        start: mouseTracker.start,
        end: mouseTracker.current,
      });
  setShapeAttributes({ shape: tempShape, selection: tempShapeSelection });
  return {
    type: DRAW_ACTION_TYPE,
    statusMessage: `Drawing ${canvas.currentUserAction.shapeType}...`,
    tempShape,
    completed: false,
  };
}

function respondWithNewFinishedSegmentAdded({
  mouseTracker,
  canvas,
}: DrawTempShapeProps<MouseDragFinished | MouseClick>): DrawResponse {
  const shapeType = canvas.currentUserAction.shapeType;
  const current = mouseTracker.type === MOUSE_CLICK_EVENT_TYPE ? mouseTracker.start : mouseTracker.end;
  const tempShapeSelection = selectTempShape({ canvas });
  const tempShape = mouseTracker.finishedSegments
    ? appendFinishedSegments({ finishedSegments: mouseTracker.finishedSegments, current })
    : getNewShape({
        shapeType,
        start: current,
        end: current,
      });

  const isDoubleClick = checkDoubleClick({ mouseTracker });
  if (isDoubleClick) {
    removeTempShapeFromCanvas();
    return {
      type: DRAW_ACTION_TYPE,
      statusMessage: `Added new shape ${shapeType}`,
      tempShape: mouseTracker.finishedSegments || tempShape,
      completed: true,
      mouseTrackerUpdate: { type: MOUSE_IDLE_EVENT_TYPE },
    };
  }
  setShapeAttributes({ shape: tempShape, selection: tempShapeSelection });
  return {
    type: DRAW_ACTION_TYPE,
    statusMessage: `Drawing ${shapeType}...`,
    tempShape,
    completed: false,
    mouseTrackerUpdate: {
      type: MOUSE_DRAG_ACTIVE_EVENT_TYPE,
      start: mouseTracker.start,
      current,
      target: mouseTracker.target,
      finishedSegments: tempShape,
      eventSteam: mouseTracker.eventSteam,
    },
  };
}

const MAX_DOUBLE_CLICK_DISTANCE = 10;
const MAX_DOUBLE_CLICK_TIME = 500;

function checkDoubleClick({ mouseTracker }: { mouseTracker: MouseDragFinished | MouseClick }): boolean {
  const last = mouseTracker.eventSteam.at(-1);
  const secondLast = mouseTracker.eventSteam.at(-2);
  if (!last || !secondLast) {
    // there are less than two recorded clicks: this cannot be a double click
    return false;
  }
  const timeSinceLastClick = secondLast.time - last.time;
  const distance = pointDistance({ leftArg: last.position, rightArg: secondLast.position });
  return timeSinceLastClick < MAX_DOUBLE_CLICK_TIME && distance < MAX_DOUBLE_CLICK_DISTANCE;
}
