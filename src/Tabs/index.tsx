import AreaTypeSelectionMenu from './AreaTypeSelectionMenu';
import styles from './styles.module.css';
import TabAreaLayout from './TabAreaLayout';

export default function Tabs() {
  return (
    <div className={styles.tabAreaWithTopBar}>
      <AreaTypeSelectionMenu />
      <TabAreaLayout />
    </div>
  );
}
