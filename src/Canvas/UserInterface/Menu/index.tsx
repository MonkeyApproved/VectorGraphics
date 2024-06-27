import { ShapeType } from 'src/redux/types';
import styles from './styles.module.css';
import { setUserAction, useAppDispatch } from 'src/redux/reducers';
import { ReactSetState } from '../types';
import MenuButton from './MenuButton';

interface MenuProps {
  canvasId: string;
  status: string;
  setStatus: ReactSetState<string>;
}

export default function Menu({ canvasId, status, setStatus }: MenuProps) {
  const dispatch = useAppDispatch();

  const drawShape = ({ shapeType }: { shapeType: ShapeType }) => {
    dispatch(setUserAction({ canvasId, userAction: { type: 'drawShape', shapeType } }));
    setStatus(`Draw ${shapeType}`);
  };

  return (
    <div className={styles.menuGrid}>
      <div className={styles.leftMenuGrid}>
        <div className={styles.shapeMenu}>
          <MenuButton text="line" onClick={() => drawShape({ shapeType: 'line' })} />
          <MenuButton text="path" onClick={() => drawShape({ shapeType: 'path' })} />
          <MenuButton text="rect" onClick={() => drawShape({ shapeType: 'rect' })} />
          <MenuButton text="circle" onClick={() => drawShape({ shapeType: 'circle' })} />
          <MenuButton text="ellipse" onClick={() => drawShape({ shapeType: 'ellipse' })} />
          <MenuButton text="poly" onClick={() => drawShape({ shapeType: 'polyline' })} />
        </div>
      </div>
      <div className={styles.statusBar}>
        <span className="noSelect">{status}</span>
      </div>
    </div>
  );
}
