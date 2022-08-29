import styles from '../../styles/SvgCanvas.module.css';

export interface SvgCanvasProps {
  setSvg: (svgRef: SVGSVGElement) => void;
  viewBox: string;
}

export default function SvgCanvas({ setSvg, viewBox }: SvgCanvasProps) {
  return <svg className={styles.canvas} ref={(ref: SVGSVGElement) => setSvg(ref)} viewBox={viewBox} />;
}
