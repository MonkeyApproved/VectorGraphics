import styles from './styles.module.css';
import { useRef } from 'react';
import { UserInterface } from './UserInterface';
import CanvasBackground from './CanvasBackground';

export default function Canvas({ canvasId }: { canvasId: string }) {
  const bottomCanvasRef = useRef<SVGSVGElement>(null);

  return (
    <>
      <div className={styles.canvasWrapper}>
        <CanvasBackground canvasId={canvasId} canvasRef={bottomCanvasRef} />
        <UserInterface canvasId={canvasId} canvasRef={bottomCanvasRef} />
      </div>
    </>
  );
}
