import { applyPosition, applySize, Coordinate } from '../../svg/coordinate';
import { BaseElementType, BaseAreaElementType } from '../../svg/element';
import { CoordinateInput, SizeInput } from './DoubleNumberInput';

export type InputType = 'number' | 'string';

export interface AreaElementInputProps {
  element: BaseAreaElementType;
  updateElement: (args: { updatedElement: BaseElementType }) => void;
}

export default function AreaElementInput({ element, updateElement }: AreaElementInputProps) {
  const setPosition = (value: Coordinate) => {
    const updatedElement: BaseAreaElementType = { ...element, position: value };
    applyPosition({ element: updatedElement });
    updateElement({ updatedElement: updatedElement });
  };

  const setSize = (value: Coordinate) => {
    const updatedElement: BaseAreaElementType = { ...element, size: value };
    applySize({ element: updatedElement });
    updateElement({ updatedElement: updatedElement });
  };

  return (
    <>
      <CoordinateInput coordinate={element.position} setCoordinate={setPosition} />
      <SizeInput size={element.size} setSize={setSize} />
    </>
  );
}
