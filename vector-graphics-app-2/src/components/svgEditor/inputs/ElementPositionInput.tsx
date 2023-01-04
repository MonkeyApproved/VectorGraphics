import { updateElementPosition } from 'redux/dataStore/dataSlice';
import { Coordinate } from 'redux/dataStore/svg/coordinate';
import { BaseElement } from 'redux/dataStore/svg/element';
import { useAppDispatch } from 'redux/hooks';
import DoubleNumberInput from './DoubleNumberInput';

export default function ElementPositionInput({ element }: { element: BaseElement }) {
  const dispatch = useAppDispatch();
  const handlePositionChange = (value: Coordinate) => {
    dispatch(updateElementPosition({ elementId: element.id, position: value }));
  };

  return <DoubleNumberInput labelX="x" labelY="y" value={element.position} setValue={handlePositionChange} />;
}
