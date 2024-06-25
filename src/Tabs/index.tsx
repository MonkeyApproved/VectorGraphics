import styles from './styles.module.css';
import { changeTabAreaType, useAppDispatch } from 'src/redux/reducers';
import TabAreaLayout from './TabAreaLayout';

export default function Tabs() {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.tabAreaWithTopBar}>
      <div className={styles.topBar}>
        <div>Project name</div>
        <button className={styles.tabAreaTypeButton} onClick={() => dispatch(changeTabAreaType({ type: 'single' }))}>
          S
        </button>
        <button
          className={styles.tabAreaTypeButton}
          onClick={() => dispatch(changeTabAreaType({ type: 'twoVertical' }))}
        >
          2V
        </button>
        <button
          className={styles.tabAreaTypeButton}
          onClick={() => dispatch(changeTabAreaType({ type: 'twoHorizontal' }))}
        >
          2H
        </button>
        <button className={styles.tabAreaTypeButton} onClick={() => dispatch(changeTabAreaType({ type: 'quadrant' }))}>
          Q
        </button>
      </div>
      <TabAreaLayout />
    </div>
  );
}
