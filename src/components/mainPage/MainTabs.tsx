import { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getSelectedTabIndex, getTabContent } from 'redux/dataStore/userInterface/selectors';
import { addNewContentToTabs, selectTab } from 'redux/dataStore/dataSlice';
import MainContent from './MainContent';
import { AnyContent, MainContentTypes } from 'redux/dataStore/userInterface/content';
import { Button } from '@mui/material';
import ContentIcon from './MainContentIcon';
import AddTabModal from './AddTabModal';
import styles from './styles.module.css';

export default function MainTabs() {
  const [addTabOpen, setAddTabOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // equation id state (can be modified by click on text which opens a modal)
  const tabContent = useAppSelector(getTabContent);
  const selectedTab = useAppSelector(getSelectedTabIndex);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const contentId = tabContent[newValue].id;
    dispatch(selectTab({ id: contentId }));
  };

  const handleAddTabClose = (success: boolean, label: string, type: MainContentTypes) => {
    if (success) {
      // the user confirmed the new variable name by clicking the "Apply" button
      dispatch(addNewContentToTabs({ type, label }));
    }
    setAddTabOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AddTabModal modalOpen={addTabOpen} onClose={handleAddTabClose} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="tabs">
          {tabContent.map((content: AnyContent, index: number) => (
            <Tab
              label={
                <div className={styles.tabLabelWrapper}>
                  <ContentIcon contentType={content.type} />
                  <span>{content.label}</span>
                </div>
              }
              key={`tab-${index}`}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
          <Button variant="outlined" onClick={() => setAddTabOpen(true)}>
            <AddIcon />
          </Button>
        </Tabs>
      </Box>
      {tabContent.map((content: AnyContent, index: number) => (
        <div
          role="tabpanel"
          hidden={selectedTab !== index}
          key={`tabpanel-${index}`}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          <MainContent content={content} />
        </div>
      ))}
    </Box>
  );
}
