import { useState } from 'react';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import styles from './styles.module.css';
import ContentIcon from './ContentIcon';
import { MainContentTypes } from 'redux/dataStore/userInterface/content';
import { useAppDispatch } from 'redux/hooks';
import AddIcon from '@mui/icons-material/Add';
import { addNewContentToTabs } from 'redux/dataStore/dataSlice';

export default function AddTabModal() {
  // modal state -> used to change the equationId
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [contentLabel, setContentLabel] = useState<string>('');
  const [contentType, setContentType] = useState<MainContentTypes>('variables');
  const dispatch = useAppDispatch();

  const allowedContentTypes: MainContentTypes[] = ['variables', 'spreadsheet', 'canvas', 'data'];

  const handleModalApply = () => {
    dispatch(addNewContentToTabs({ type: contentType, label: contentLabel }));
    setContentLabel('');
    setModalOpen(false);
  };

  return (
    <>
      <div className={styles.addTabButton} onClick={() => setModalOpen(true)}>
        <AddIcon />
      </div>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} classes={{ paper: styles.modal }}>
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
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleModalApply} disabled={contentLabel.length === 0}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
