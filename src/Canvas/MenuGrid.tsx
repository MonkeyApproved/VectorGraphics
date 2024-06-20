import { Canvas } from 'src/redux';
import styles from './styles.module.css';

export default function MenuGrid({ canvas }: { canvas: Canvas }) {
  const drawShape = ({ shape }: { shape: string }) => {

  return (
    <div className={styles.menuGrid}>
      <div className={styles.topMenuGrid}>
        <div>{canvas.label}</div>
      </div>
      <div className={styles.leftMenuGrid}>
        <div className={styles.shapeMenu}>
          <button className={styles.shapeButtons}>Line</button>
          <button className={styles.shapeButtons}>Path</button>
          <button className={styles.shapeButtons}>Circle</button>
          <button className={styles.shapeButtons}>Poly</button>
        </div>
      </div>
    </div>
  );
}
