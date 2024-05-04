import React, { useState } from 'react';
import styles from './toggle.module.css';

export type Scaling = 'absolute' | 'relative';

export interface CoordinateScalingToggleProps {
  absoluteLabel: string;
  relativeLabel: string;
  initialScaling?: Scaling;
  whoYaGonnaCall?: (newValue: Scaling) => void;
}

export default function CoordinateScalingToggle({
  absoluteLabel,
  relativeLabel,
  initialScaling = 'absolute',
  whoYaGonnaCall,
}: CoordinateScalingToggleProps) {
  const [selected, setSelected] = useState(initialScaling === 'absolute' ? absoluteLabel : relativeLabel);

  const onChoiceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const value = target.innerHTML;
    if (value !== selected) {
      setSelected(value);
      if (whoYaGonnaCall && value === absoluteLabel) {
        whoYaGonnaCall('absolute');
      } else if (whoYaGonnaCall && value === relativeLabel) {
        whoYaGonnaCall('relative');
      }
    }
  };

  return (
    <div className={styles.doubleChoice}>
      <button className={styles.selected}>{selected}</button>
      <div className={styles.choices} onClick={onChoiceClick}>
        <button className={styles.choice1}>{absoluteLabel}</button>
        <button className={styles.choice2}>{relativeLabel}</button>
      </div>
    </div>
  );
}
