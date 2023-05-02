import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getSelectedTabIndex, getTabContent } from 'redux/dataStore/userInterface/selectors';
import { selectTab } from 'redux/dataStore/dataSlice';
import MainContent from './MainContent';
import { UiContent } from 'redux/dataStore/userInterface/mainContent';

export default function MainTabs() {
  const dispatch = useAppDispatch();

  // equation id state (can be modified by click on text which opens a modal)
  const tabContent = useAppSelector(getTabContent);
  const selectedTab = useAppSelector(getSelectedTabIndex);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const contentId = tabContent[newValue].id;
    dispatch(selectTab({ id: contentId }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="tabs">
          {tabContent.map((content: UiContent, index: number) => (
            <Tab label={content.label} key={`tab-${index}`} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
          ))}
        </Tabs>
      </Box>
      {tabContent.map((content: UiContent, index: number) => (
        <div
          role="tabpanel"
          hidden={selectedTab !== index}
          key={`tabpanel-${index}`}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          <MainContent id={content.id} />
        </div>
      ))}
    </Box>
  );
}
