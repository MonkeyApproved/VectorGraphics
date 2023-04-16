import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';

export interface TabDict {
  [label: string]: JSX.Element;
}

export default function MainTabs({ tabDict }: { tabDict: TabDict }) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          {Object.keys(tabDict).map((label: string, index: number) => (
            <Tab label={label} key={`tab-${index}`} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
          ))}
        </Tabs>
      </Box>
      {Object.values(tabDict).map((element: JSX.Element, index: number) => (
        <div
          role="tabpanel"
          hidden={value !== index}
          key={`tabpanel-${index}`}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          {value === index && element}
        </div>
      ))}
    </Box>
  );
}
