import { getShapeContext } from 'src/redux/context';
import { getCanvasElementDetails, useAppSelector } from 'src/redux/selectors';
import SvgContextGroup from '../SvgContextGroup';

export default function SingleElementMenu({ elementId, canvasId }: { elementId: string; canvasId: string }) {
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
