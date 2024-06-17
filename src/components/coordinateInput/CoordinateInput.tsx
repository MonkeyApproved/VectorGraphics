import CoordinateInput1D from 'components/inputs/CoordinateInput1D';
import CoordinateScalingToggle from './CoordinateScalingToggle';
import styles from './input.module.css';

export interface CoordinateInputProps {
  x: number;
  y: number;
}

export default function CoordinateInput({ x, y }: CoordinateInputProps) {
  return (
    <>
      <div style={{ width: '200px', position: 'absolute', top: '40px', left: '200px' }}>
        <div className={styles.coordinateInput}>
          <CoordinateScalingToggle absoluteLabel="x" relativeLabel="dx" />
          <div key={`variable-value-x`} className={styles.equationInput}>
            <div className={styles.result}>{'123'}</div>
            <input className={styles.input} value={'123'} onChange={(e) => console.log(e.target.value)}></input>
          </div>
          <CoordinateScalingToggle absoluteLabel="y" relativeLabel="dy" />
          <div key={`variable-value-x`} className={styles.equationInput}>
            <div className={styles.result}>{'3218888888'}</div>
            <input className={styles.input} value={'3218888888'} onChange={(e) => console.log(e.target.value)}></input>
          </div>
        </div>
      </div>
      <div style={{ width: '200px', position: 'absolute', top: '440px', left: '200px' }}>
        <CoordinateInput1D unit="px" equationId="pos123" />
      </div>
    </>
  );
}
