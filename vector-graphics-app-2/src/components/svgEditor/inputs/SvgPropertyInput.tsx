import EquationInput from 'components/equationInputs/EquationInput';
import { CSSProperties } from 'react';
import { SvgProperty } from 'redux/dataStore/equations/svgEquation';
import { getSvgPropertyValue } from 'redux/dataStore/svg/selectors';
import { useAppSelector } from 'redux/hooks';
import NumberInput from './NumberInput';

export interface SvgPropertyInputProps {
  svgProperty: SvgProperty;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function SvgPropertyInput(props: SvgPropertyInputProps) {
  const propertyValue = useAppSelector(getSvgPropertyValue(props.svgProperty));

  if (typeof propertyValue === 'string') {
    return <EquationInput equationId={propertyValue} {...props} />;
  } else {
    return <NumberInput {...props} />;
  }
}
