import { selectSelectedElement } from '../../../redux/dataStore/dataSelectors';
import { BaseElement } from '../../../redux/dataStore/svg/element';
import { useAppSelector } from '../../../redux/hooks';
import ElementPositionInput from './ElementPositionInput';
import ElementSizeInput from './ElementSizeInput';

export default function ElementSettings() {
  const element: BaseElement | undefined = useAppSelector(selectSelectedElement);

  if (!element) return <></>;

  return (
    <div>
      <ElementPositionInput element={element} />
      <ElementSizeInput element={element} />
    </div>
  );
}
