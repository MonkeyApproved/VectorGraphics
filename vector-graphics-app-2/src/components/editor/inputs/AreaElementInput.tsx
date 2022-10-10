import { applyPosition, applySize, Coordinate } from '../../svg/coordinate';
import { BaseElement, selectElementById } from '../../svg/element';
import { CoordinateInput, SizeInput } from './DoubleNumberInput';

export type InputType = 'number' | 'string';

export interface AreaElementInputProps {
  element: BaseElement;
  updateElement: (args: { updatedElement: BaseElement }) => void;
}

export default function AreaElementInput({ element, updateElement }: AreaElementInputProps) {
  const setPosition = (value: Coordinate) => {
    const updatedElement: BaseElement = { ...element, position: value };
    applyPosition({ element: updatedElement, elementSelection: selectElementById({ elementId: updatedElement.id }) });
    updateElement({ updatedElement: updatedElement });
  };

  const setSize = (value: Coordinate) => {
    const updatedElement: BaseElement = { ...element, size: value };
    applySize({ element: updatedElement, elementSelection: selectElementById({ elementId: updatedElement.id }) });
    updateElement({ updatedElement: updatedElement });
  };

  return (
    <>
      <CoordinateInput coordinate={element.position} setCoordinate={setPosition} />
      <SizeInput size={element.size} setSize={setSize} />
    </>
  );
}
