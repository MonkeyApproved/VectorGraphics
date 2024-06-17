import React from 'react';
import cn from 'classnames';
import cssStyles from './ScalingToggle.module.css';

export interface ScalingToggleStyles {
  wrapperClass?: string;
  wrapperStyles?: React.CSSProperties;
  buttonClass?: string;
  buttonStyles?: React.CSSProperties;
}

export interface ScalingToggleProps<T = string> {
  choiceLeft: T;
  choiceRight: T;
  value: T;
  onValueChange?: (newValue: T) => void;
  styles?: ScalingToggleStyles;
}

export default function Toggle2Choices<T>(props: ScalingToggleProps<T>) {
  const onChoiceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const newValue = target.innerHTML;

    if (props.value !== newValue && props.onValueChange) {
      props.onValueChange(newValue as T);
    }
  };

  return (
    <div className={cn(cssStyles.wrapper, props.styles?.wrapperClass)} style={props.styles?.wrapperStyles}>
      <button className={cn(cssStyles.selected, props.styles?.buttonClass)} style={props.styles?.buttonStyles}>
        {props.value as string}
      </button>
      <div className={cssStyles.choices} onClick={onChoiceClick}>
        <button className={cssStyles.choice1}>{props.choiceLeft as string}</button>
        <button className={cssStyles.choice2}>{props.choiceRight as string}</button>
      </div>
    </div>
  );
}
