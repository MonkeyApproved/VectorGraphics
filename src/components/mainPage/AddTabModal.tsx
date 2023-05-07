import { useState } from 'react';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import styles from '../equationInputs/styles.module.css';
import ContentIcon from './MainContentIcon';
import { MainContentTypes } from 'redux/dataStore/userInterface/content';

export interface AddTabModalProps {
  modalOpen: boolean;
  onClose: (success: boolean, label: string, type: MainContentTypes) => void;
}

export default function AddTabModal(props: AddTabModalProps) {
  // modal state -> used to change the equationId
  const [contentLabel, setContentLabel] = useState<string>('');
  const [contentType, setContentType] = useState<MainContentTypes>('variables');

  const allowedContentTypes: MainContentTypes[] = ['variables', 'spreadsheet', 'canvas', 'data'];

  const handleModalApply = () => {
    props.onClose(true, contentLabel, contentType);
    setContentLabel('');
  };

  const handleModalCancel = () => {
    props.onClose(false, contentLabel, contentType);
  };

  return (
    <Dialog open={props.modalOpen} onClose={handleModalCancel} classes={{ paper: styles.modal }}>
      <DialogContent>
        <ButtonGroup disableElevation aria-label="Disabled elevation buttons">
          {allowedContentTypes.map((type) => (
            <Button
              key={`type-selection-${type}`}
              variant={contentType === type ? 'contained' : 'outlined'}
              onClick={() => setContentType(type)}
            >
              <ContentIcon contentType={type} />
            </Button>
          ))}
        </ButtonGroup>
        <TextField
          autoFocus
          value={contentLabel}
          onChange={(e) => setContentLabel(e.target.value)}
          margin="dense"
          id="name"
          label="Tab label"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalCancel}>Cancel</Button>
        <Button onClick={handleModalApply} disabled={contentLabel.length === 0}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
