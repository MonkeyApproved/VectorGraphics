import { ContextGroup, SvgCoordinateContext, svgCoordinateUsages } from 'src/redux/context';
import SvgCoordinateInput from '../SvgCoordinateInput';

export default function SvgContextGroup({ contextGroup }: { contextGroup: ContextGroup }) {
  return (
    <div>
      <span>{contextGroup.label}</span>
      {contextGroup.contexts.map((context) => {
        if (svgCoordinateUsages.includes(context.usage)) {
          return <SvgCoordinateInput key={context.name} context={context as SvgCoordinateContext} />;
        }
        return null;
      })}
    </div>
  );
}
