import { CSSProperties } from 'react';
import cn from 'classnames';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { submitEquation, updateElementProperty } from 'redux/dataStore/dataSlice';
import { getEquationById } from 'redux/dataStore/equations/selectors';
import { SvgProperty } from 'redux/dataStore/equations/svgEquation';
import cssStyles from './CoordinateInput1D.module.css';
import ScalingToggle, { Scaling } from './ScalingToggle';
import InputWithResult from './InputWithResult';

export interface CoordinateInput1DStyles {
  wrapperClass: string;
  wrapperStyles: CSSProperties;
}

export interface CoordinateInput1DProps {
  dimension: 'x' | 'y';
  equationId: string;
  svgProperty?: SvgProperty;
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
      dispatch(submitEquation({ id: props.equationId, input: newValue }));
    } else {
      dispatch(updateElementProperty({ property: props.svgProperty, value: newValue }));
    }
  };

  const onScalingChange = (newScaling: Scaling) => {
    console.log(`New scaling: ${newScaling}`);
  };

  const getDisplayValue = () => {
    if (!equation?.input) return '';
    if (equation.errorMessage) return equation.input;
    if (equation.result) return equation.result;
    return equation.input;
  };

  return (
    <div className={cn(cssStyles.coordinateInput, props.styles?.wrapperClass)} style={props.styles?.wrapperStyles}>
      <ScalingToggle
        absoluteLabel={props.dimension}
        relativeLabel={`d${props.dimension}`}
        scaling="absolute"
        onScalingChange={onScalingChange}
        styles={{ buttonClass: cssStyles.scale }}
      />
      <InputWithResult
        value={equation?.input || ''}
        result={getDisplayValue()}
        onValueChange={onValueChange}
        styles={{ inputClass: cssStyles.value, resultClass: cssStyles.value }}
      />
    </div>
  );
}
