import styles from './styles.module.css';
import { changeTabAreaType, useAppDispatch } from 'src/redux/reducers';
import MenuButton from 'src/generalComponents/MenuButton';
import TextNoSelect from 'src/generalComponents/TextNoSelect';

export default function AreaTypeSelectionMenu() {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.topBar}>
      <TextNoSelect>Project name</TextNoSelect>
      <MenuButton
        text="1S"
        className={styles.tabAreaTypeButton}
        onClick={() => dispatch(changeTabAreaType({ type: 'single' }))}
      />
      <MenuButton
        text="2V"
        className={styles.tabAreaTypeButton}
        onClick={() => dispatch(changeTabAreaType({ type: 'twoVertical' }))}
      />
      <MenuButton
        text="2H"
        className={styles.tabAreaTypeButton}
        onClick={() => dispatch(changeTabAreaType({ type: 'twoHorizontal' }))}
      />
      <MenuButton
        text="4Q"
        className={styles.tabAreaTypeButton}
        onClick={() => dispatch(changeTabAreaType({ type: 'quadrant' }))}
      />
    </div>
  );
}
