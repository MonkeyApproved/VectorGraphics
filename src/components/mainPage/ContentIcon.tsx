import DrawIcon from '@mui/icons-material/Draw';
import CalculateIcon from '@mui/icons-material/Calculate';
import AppsIcon from '@mui/icons-material/Apps';
import SourceIcon from '@mui/icons-material/Source';
import { MainContentTypes } from 'redux/dataStore/userInterface/content';

export default function ContentIcon({ contentType }: { contentType: MainContentTypes }) {
  if (contentType === 'canvas') {
    return <DrawIcon />;
  } else if (contentType === 'spreadsheet') {
    return <AppsIcon />;
  } else if (contentType === 'variables') {
    return <CalculateIcon />;
  } else if (contentType === 'data') {
    return <SourceIcon />;
  }
  return <></>;
}
