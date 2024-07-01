import { getShapeContext } from 'src/redux/context';
import { getCanvasElementDetails, useAppSelector } from 'src/redux/selectors';
import SvgContextGroup from '../SvgContextGroup';
import { ElementDetails } from 'src/redux/types';

export interface SingleElementMenuProps {
  elementId: string;
  canvasId: string;
  elementShownInMenu?: ElementDetails;
}

export default function SingleElementMenu({ elementId, canvasId, elementShownInMenu }: SingleElementMenuProps) {
  if (!elementShownInMenu) {
    return <ElementIdMenu elementId={elementId} canvasId={canvasId} />;
  }
  return <ElementShownInMenu elementShownInMenu={elementShownInMenu} />;
}

function ElementShownInMenu({ elementShownInMenu }: { elementShownInMenu: ElementDetails }) {
  const contextStructure = getShapeContext({ shape: elementShownInMenu.shape });

  return (
    <div>
      {contextStructure.map((context) => (
        <SvgContextGroup key={context.label} contextGroup={context} />
      ))}
    </div>
  );
}

function ElementIdMenu({ elementId, canvasId }: SingleElementMenuProps) {
  const details = useAppSelector((state) => getCanvasElementDetails(state, elementId, canvasId));
  const contextStructure = getShapeContext({ shape: details.shape });

  return (
    <div>
      {contextStructure.map((context) => (
        <SvgContextGroup key={context.label} contextGroup={context} />
      ))}
    </div>
  );
}
