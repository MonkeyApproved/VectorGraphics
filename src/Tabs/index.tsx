import { getTabAreaType, useAppSelector } from 'src/redux/selectors';
import styles from './styles.module.css';
import { changeTabAreaType, useAppDispatch } from 'src/redux/reducers';
import TabAreaLayout from './TabAreaLayout';

export default function Tabs() {
  const tabAreaType = useAppSelector(getTabAreaType);
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
          onClick={() => dispatch(changeTabAreaType({ type: 'two-vertical' }))}
        >
          2V
        </button>
        <button
          className={styles.tabAreaTypeButton}
          onClick={() => dispatch(changeTabAreaType({ type: 'two-horizontal' }))}
        >
          2H
        </button>
        <button className={styles.tabAreaTypeButton} onClick={() => dispatch(changeTabAreaType({ type: 'quadrant' }))}>
          Q
        </button>
      </div>
      <TabAreaLayout tabAreaType={tabAreaType} />
    </div>
  );
}
