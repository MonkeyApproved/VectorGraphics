import { Canvas, ShapeType, setUserAction, useAppDispatch } from 'src/redux';
import styles from './styles.module.css';

export default function MenuGrid({ canvas, status }: { canvas: Canvas; status: string }) {
  const dispatch = useAppDispatch();

  const drawShape = ({ shapeType }: { shapeType: ShapeType }) => {
    dispatch(setUserAction({ canvasId: canvas.id, userAction: { type: 'drawShape', shapeType } }));
  };

  return (
    <div className={styles.menuGrid}>
      <div className={styles.topMenuGrid}>
        <div>{status}</div>
      </div>
      <div className={styles.leftMenuGrid}>
        <div className={styles.shapeMenu}>
          <button className={styles.shapeButtons} onClick={() => drawShape({ shapeType: 'line' })}>
            Line
          </button>
          <button className={styles.shapeButtons} onClick={() => drawShape({ shapeType: 'path' })}>
            Path
          </button>
          <button className={styles.shapeButtons} onClick={() => drawShape({ shapeType: 'circle' })}>
            Circle
          </button>
          <button className={styles.shapeButtons} onClick={() => drawShape({ shapeType: 'polygon' })}>
            Poly
          </button>
        </div>
      </div>
    </div>
  );
}
