import { RefObject, useState } from 'react';
import CanvasMouseEvents from './CanvasMouseEvents';
import MenuGrid from './Menu';

interface UserInterfaceProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
}

export function UserInterface({ canvasId, canvasRef }: UserInterfaceProps) {
  const [status, setStatus] = useState<string>('');

  return (
    <>
      <CanvasMouseEvents canvasId={canvasId} canvasRef={canvasRef} setStatus={setStatus} />
      <MenuGrid canvasId={canvasId} status={status} setStatus={setStatus} />
    </>
  );
}
