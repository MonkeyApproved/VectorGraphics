import { ButtonGroup, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { addPath, setActiveTool } from 'redux/dataStore/dataSlice';
import { getActiveTool } from 'redux/dataStore/svg/selectors';
import { SvgTool } from 'redux/dataStore/svg/settings';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

export default function HeaderMenu() {
  const [path, setPath] = useState<string>('');
  const activeTool = useAppSelector(getActiveTool);
  const dispatch = useAppDispatch();

  const onClick = (tool: SvgTool) => {
    dispatch(setActiveTool({ tool }));
  };

  const submitPath = () => {
    dispatch(addPath({ definition: path }));
    setPath('');
  };

  return (
    <div>
      <ButtonGroup variant="outlined" aria-label="header tool selection">
        <Button variant={activeTool === 'addLine' ? 'contained' : 'outlined'} onClick={() => onClick('addLine')}>
          Line
        </Button>
        <Button variant={activeTool === 'addEllipse' ? 'contained' : 'outlined'} onClick={() => onClick('addEllipse')}>
          Circle
        </Button>
        <Button variant={activeTool === 'addRect' ? 'contained' : 'outlined'} onClick={() => onClick('addRect')}>
          Rect
        </Button>
        <Button variant={activeTool === 'select' ? 'contained' : 'outlined'} onClick={() => onClick('select')}>
          Select
        </Button>
      </ButtonGroup>
      <TextField
        autoFocus
        style={{ paddingLeft: '40px', width: '40%' }}
        value={path}
        onChange={(e) => setPath(e.target.value)}
        margin="dense"
        id="pathInput"
        variant="standard"
      />
      <Button variant="outlined" onClick={() => submitPath()}>
        Add Path
      </Button>
    </div>
  );
}
