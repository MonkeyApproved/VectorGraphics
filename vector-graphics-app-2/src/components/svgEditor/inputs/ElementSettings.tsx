import { getSelectedElementId } from 'redux/dataStore/svg/selectors';
import { useAppSelector } from 'redux/hooks';
import CoordinateInput from './CoordinateInput';

export default function ElementSettings() {
  const elementId = useAppSelector(getSelectedElementId);

  if (!elementId) return <></>;

  return (
    <div>
      <CoordinateInput elementId={elementId} type="position" />
      <CoordinateInput elementId={elementId} type="size" />
    </div>
  );
}
