import { useAppDispatch } from '../../redux/hooks';
import { setCanvasId } from '../../redux/dataStore/dataSlice';
import styles from '../../styles/SvgCanvas.module.css';
import { ELEMENT_ID_PREFIX } from '../../redux/dataStore/svg/element';

export interface SvgCanvasProps {
  svgId: string;
  viewBox: string;
}

export default function SvgCanvas({ svgId, viewBox }: SvgCanvasProps) {
  const dispatch = useAppDispatch();

  return (
    <svg
      className={styles.canvas}
      id={`${ELEMENT_ID_PREFIX}${svgId}`}
      viewBox={viewBox}
      ref={() => dispatch(setCanvasId({ canvasId: svgId }))}
    />
  );
}
