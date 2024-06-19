/* eslint-disable no-console */
import { getCanvas, useAppSelector } from 'src/redux';
import styles from './styles.module.css';
import MenuGrid from './MenuGrid';

export default function Canvas({ canvasId }: { canvasId: string }) {
  const canvas = useAppSelector(getCanvas({ canvasId }));

  return (
    <>
      <div className={styles.canvasWrapper}>
        <svg className={styles.bottomCanvas} id={`${canvasId}-bottom`} viewBox={canvas.viewBox} />
        <svg className={styles.canvas} id={`${canvasId}-top`} viewBox={canvas.viewBox} />
      </div>
      <MenuGrid canvas={canvas} />
    </>
  );
}
