import { Stack } from '@mui/material';
import ElementSettings from './inputs/ElementSettings';
import SingleElementSelector from './inputs/SingleElementSelector';

export default function LeftSideMenu() {
  return (
    <Stack spacing={2}>
      <SingleElementSelector />
      <ElementSettings />
    </Stack>
  );
}
