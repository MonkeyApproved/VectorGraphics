import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getSelectedTabId, getTabContentIds } from 'redux/dataStore/userInterface/selectors';
import { selectTab } from 'redux/dataStore/dataSlice';
import AddTabModal from './AddTabModal';
import styles from './styles.module.css';
import TabButton from './TabButton';
import MainContent from './MainContent';
import { shallowEqual } from 'react-redux';

export default function MainTabs() {
  const dispatch = useAppDispatch();

  // equation id state (can be modified by click on text which opens a modal)
  const contentIds = useAppSelector(getTabContentIds, shallowEqual);
  const selectedId = useAppSelector(getSelectedTabId);

  const handleChange = (newId: string) => {
    dispatch(selectTab({ id: newId }));
  };

  console.log('tabs render');

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {contentIds.map((id: string) => (
          <TabButton contentId={id} key={`tab-button-${id}`} selected={id === selectedId} onClick={handleChange} />
        ))}
        <AddTabModal />
      </div>
      <div className={styles.content}>
        <MainContent contentId={selectedId} />
      </div>
    </div>
  );
}
