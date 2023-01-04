import { updateElementSize } from 'redux/dataStore/dataSlice';
import { Coordinate } from 'redux/dataStore/svg/coordinate';
import { BaseElement } from 'redux/dataStore/svg/element';
import { useAppDispatch } from 'redux/hooks';
import DoubleNumberInput from './DoubleNumberInput';

export default function ElementSizeInput({ element }: { element: BaseElement }) {
  const dispatch = useAppDispatch();
  const handleSizeChange = (value: Coordinate) => {
    dispatch(updateElementSize({ elementId: element.id, size: value }));
  };

  return <DoubleNumberInput labelX="width" labelY="height" value={element.size} setValue={handleSizeChange} />;
}
