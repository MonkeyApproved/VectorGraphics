import { Coordinate } from 'redux/dataStore/svg/coordinate';
import { BaseElement } from 'redux/dataStore/svg/element';
import { KeysMatchingType } from 'types';
import SvgPropertyInput from './SvgPropertyInput';
import { CSSProperties } from 'react';

export interface CoordinateInputProps {
  type: KeysMatchingType<BaseElement, Coordinate>;
  elementId: string;
  className?: string;
  style?: CSSProperties;
}

export default function CoordinateInput(props: CoordinateInputProps) {
  return (
    <>
      <SvgPropertyInput svgProperty={{ elementId: props.elementId, type: props.type, dimension: 'x' }} />
      <SvgPropertyInput svgProperty={{ elementId: props.elementId, type: props.type, dimension: 'y' }} />
    </>
  );
}
