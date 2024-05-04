import React from 'react';
import cn from 'classnames';
import cssStyles from './ScalingToggle.module.css';

export type Scaling = 'absolute' | 'relative';

export interface ScalingToggleStyles {
  wrapperClass?: string;
  wrapperStyles?: React.CSSProperties;
  buttonClass?: string;
  buttonStyles?: React.CSSProperties;
}

export interface ScalingToggleProps {
  relativeLabel: string;
  absoluteLabel: string;
  scaling: Scaling;
  onScalingChange?: (newScaling: Scaling) => void;
  styles?: ScalingToggleStyles;
}

export default function ScalingToggle({
  absoluteLabel,
  relativeLabel,
  scaling,
  onScalingChange,
  styles,
}: ScalingToggleProps) {
  const onChoiceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const label = target.innerHTML;

    const newScaling: Scaling = label === absoluteLabel ? 'absolute' : 'relative';

    if (newScaling !== scaling && onScalingChange) {
      onScalingChange(newScaling);
    }
  };

  return (
    <div className={cn(cssStyles.wrapper, styles?.wrapperClass)} style={styles?.wrapperStyles}>
      <button className={cn(cssStyles.selected, styles?.buttonClass)} style={styles?.buttonStyles}>
        {scaling === 'absolute' ? absoluteLabel : relativeLabel}
      </button>
      <div className={cssStyles.choices} onClick={onChoiceClick}>
        <button className={cssStyles.choice1}>{absoluteLabel}</button>
        <button className={cssStyles.choice2}>{relativeLabel}</button>
      </div>
    </div>
  );
}
