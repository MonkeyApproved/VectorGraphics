import { RefObject, useState } from 'react';
import CanvasMouseEvents from './CanvasMouseEvents';
import Menu from './Menu';
import { ElementDetails } from 'src/redux/types';

interface UserInterfaceProps {
  canvasId: string;
  canvasRef: RefObject<SVGSVGElement>;
}

export function UserInterface({ canvasId, canvasRef }: UserInterfaceProps) {
  const [status, setStatus] = useState<string>('');
  const [elementShownInMenu, setElementShownInMenu] = useState<ElementDetails>();

  return (
    <>
      <CanvasMouseEvents
        canvasId={canvasId}
        canvasRef={canvasRef}
        setStatus={setStatus}
        setElementShownInMenu={setElementShownInMenu}
      />
      <Menu canvasId={canvasId} status={status} setStatus={setStatus} elementShownInMenu={elementShownInMenu} />
    </>
  );
}
