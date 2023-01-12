import EquationInput from 'components/equationInputs/EquationInput';
import { CoordinateEquations } from 'redux/dataStore/svg/coordinate';
import { BaseElement } from 'redux/dataStore/svg/element';
import { getElementAttribute } from 'redux/dataStore/svg/selectors';
import { useAppSelector } from 'redux/hooks';
import { KeysMatchingType } from 'types';

export interface CoordinateInputProps {
  type: KeysMatchingType<BaseElement, CoordinateEquations>;
  elementId: string;
}

export default function CoordinateInput({ type, elementId }: CoordinateInputProps) {
  const coordinateEquations = useAppSelector(getElementAttribute<CoordinateEquations>(elementId, type));
  return (
    <>
      <EquationInput equationId={coordinateEquations.x} />
      <EquationInput equationId={coordinateEquations.y} />
    </>
  );
}
