import { CSSProperties } from 'react';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { submitEquation, updateElementProperty } from 'redux/dataStore/dataSlice';
import { getEquationById } from 'redux/math/selectors';
import { SvgProperty, Unit } from 'redux/dataStore/svg/context';
import cssStyles from './CoordinateInput1D.module.css';
import ScalingToggle from './ScalingToggle';
import InputWithResult from './InputWithResult';

export interface CoordinateInput1DStyles {
  wrapperClass: string;
  wrapperStyles: CSSProperties;
}

export interface CoordinateInput1DProps {
  unit: Unit;
  equationId: string;
  svgProperty: SvgProperty;
  styles?: CoordinateInput1DStyles;
}

export default function CoordinateInput1D(props: CoordinateInput1DProps) {
  const dispatch = useAppDispatch();

  // equation id state (can be modified by click on text which opens a modal)
  const equation = useAppSelector(getEquationById(props.equationId));

  if (!equation) {
    // equation does not exist yet -> add it to the store with empty string as initial value
    dispatch(submitEquation({ id: props.equationId, input: '' }));
  }

  const onValueChange = (newValue: string) => {
    if (newValue === equation?.input) return;
    if (!props.svgProperty) {
      dispatch(updateElementProperty({ property: props.svgProperty, value: newValue }));
    }
  };

  const onScalingChange = () => {
    // update unit in equation
  };

  const getDisplayValue = () => {
    if (!equation?.input) return '';
    if (equation.errorMessage) return equation.input;
    if (equation.result) return equation.result;
    return equation.input;
  };

  return (
    <div className={cn(cssStyles.coordinateInput, props.styles?.wrapperClass)} style={props.styles?.wrapperStyles}>
      <div className={cssStyles.label}>{props.svgProperty.dimension}=</div>
      <InputWithResult value={equation?.input || ''} result={getDisplayValue()} onValueChange={onValueChange} />
      <ScalingToggle<Unit>
        choiceLeft="px"
        choiceRight="%"
        value={props.unit}
        onValueChange={onScalingChange}
        styles={{ buttonClass: cssStyles.unit }}
      />
    </div>
  );
}
