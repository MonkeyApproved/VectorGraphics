import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import FunctionsIcon from '@mui/icons-material/Functions';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';

export default function ToggleButtons() {
  const [alignment, setAlignment] = useState<string | null>('left');

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment} aria-label="text alignment">
      <ToggleButton value="left" aria-label="left aligned">
        <AbcIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <PinIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <FunctionsIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
