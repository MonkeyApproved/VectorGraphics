import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getContentType, getSelectedTabId, getTabContentIds } from 'redux/dataStore/userInterface/selectors';
import { selectTab } from 'redux/dataStore/dataSlice';
import cn from 'classnames';
import AddTabModal from './AddTabModal';
import styles from './styles.module.css';
import TabButton from './TabButton';
import MainContent from './MainContent';
import { shallowEqual } from 'react-redux';
import { MainContentTypes } from 'redux/dataStore/userInterface/content';

function getContentBgdStyle(contentType: MainContentTypes | undefined | '') {
  if (contentType === 'variables') return styles.variableBgd;
  if (contentType === 'spreadsheet') return styles.spreadsheetBgd;
  if (contentType === 'canvas') return styles.canvasBgd;
  return undefined;
}

export default function MainTabs() {
  const dispatch = useAppDispatch();

  // equation id state (can be modified by click on text which opens a modal)
  const contentIds = useAppSelector(getTabContentIds, shallowEqual);
  const selectedId = useAppSelector(getSelectedTabId);
  const contentType = selectedId && useAppSelector(getContentType(selectedId));

  const handleChange = (newId: string) => {
    dispatch(selectTab({ id: newId }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {contentIds.map((id: string) => (
          <TabButton contentId={id} key={`tab-button-${id}`} selected={id === selectedId} onClick={handleChange} />
        ))}
        <AddTabModal />
      </div>
      <div className={cn(styles.content, getContentBgdStyle(contentType))}>
        <MainContent contentId={selectedId} />
      </div>
    </div>
  );
}
