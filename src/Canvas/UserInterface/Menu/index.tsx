import styles from './styles.module.css';
import { setUserAction, useAppDispatch } from 'src/redux/reducers';
import { ReactSetState } from '../types';
import { ReactNode, useState } from 'react';
import { SubMenuItem, drawShapeMenu, mainMenu, selectMenu } from './menuStructure';
import { MainMenuButton, SubMenuButton } from './Buttons';
import { getCurrentUserAction, useAppSelector } from 'src/redux/selectors';
import { MainUserActionTypes } from 'src/redux/types';

interface MenuProps {
  canvasId: string;
  status: string;
  setStatus: ReactSetState<string>;
}

export default function Menu({ canvasId, status, setStatus }: MenuProps) {
  // current selection
  const currentUserAction = useAppSelector(getCurrentUserAction({ canvasId }));
  const [selectedMainAction, setSelectedMainAction] = useState<MainUserActionTypes>(currentUserAction.type);
  const dispatch = useAppDispatch();

  const onMainButtonClick = (mainAction: MainUserActionTypes) => {
    setSelectedMainAction(mainAction);
    if (mainAction === 'drawShape') {
      dispatch(setUserAction({ canvasId, userAction: drawShapeMenu[0].data }));
    } else if (mainAction === 'select') {
      dispatch(setUserAction({ canvasId, userAction: selectMenu[0].data }));
    } else if (mainAction === 'settings') {
      dispatch(setUserAction({ canvasId, userAction: { type: 'settings' } }));
    }
  };

  const onSubMenuClick = (menuItem: SubMenuItem) => {
    setStatus(menuItem.status || '');
    dispatch(setUserAction({ canvasId, userAction: menuItem.data }));
  };

  let subMenu: ReactNode[] = [];
  if (selectedMainAction === 'drawShape') {
    subMenu = drawShapeMenu.map((menuItem) => {
      const selected =
        currentUserAction.type === 'drawShape' && currentUserAction.shapeType === menuItem.data.shapeType;
      return <SubMenuButton key={menuItem.text} menuItem={menuItem} selected={selected} onClick={onSubMenuClick} />;
    });
  } else if (selectedMainAction === 'select') {
    subMenu = selectMenu.map((menuItem) => {
      const selected = currentUserAction.type === 'select' && currentUserAction.mode === menuItem.data.mode;
      return <SubMenuButton key={menuItem.text} menuItem={menuItem} selected={selected} onClick={onSubMenuClick} />;
    });
  }

  return (
    <div className={styles.menuGrid}>
      <div className={styles.mainMenuWrapper}>
        <div className={styles.mainMenu}>
          {mainMenu.map((menuItem) => (
            <MainMenuButton
              key={menuItem.text}
              menuItem={menuItem}
              selected={selectedMainAction === menuItem.data}
              onClick={onMainButtonClick}
            />
          ))}
        </div>
      </div>
      <div className={styles.subMenuWrapper}>
        <div className={styles.subMenu}>{subMenu}</div>
      </div>
      <div className={styles.statusBar}>
        <span className="noSelect">{status}</span>
      </div>
    </div>
  );
}
