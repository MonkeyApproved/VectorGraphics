import { getSelectedElement } from 'redux/dataStore/dataSelectors';
import { BaseElement } from 'redux/dataStore/svg/element';
import { useAppSelector } from 'redux/hooks';
import ElementPositionInput from './ElementPositionInput';
import ElementSizeInput from './ElementSizeInput';
import ElementStrokeInput from './ElementStrokeInput';

export default function ElementSettings() {
  const element: BaseElement | undefined = useAppSelector(getSelectedElement);

  if (!element) return <></>;

  return (
    <div>
      <ElementStrokeInput element={element} />
      <ElementPositionInput element={element} />
      <ElementSizeInput element={element} />
    </div>
  );
}
