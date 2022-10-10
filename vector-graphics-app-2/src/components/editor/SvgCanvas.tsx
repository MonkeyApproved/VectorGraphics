import styles from '../../styles/SvgCanvas.module.css';

export interface SvgCanvasProps {
  svgId: string;
  viewBox: string;
}

export default function SvgCanvas({ svgId, viewBox }: SvgCanvasProps) {
  return <svg className={styles.canvas} id={svgId} viewBox={viewBox} />;
}
