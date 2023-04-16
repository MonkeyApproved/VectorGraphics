import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useAppSelector } from 'redux/hooks';
import styles from './styles.module.css';
import { checkIfEquationIdExists } from 'redux/dataStore/equations/selectors';

export interface EquationIdModalProps {
  equationId: string;
  modalOpen: boolean;
  onClose: (success: boolean, newId: string) => void;
}

export default function EquationIdModal(props: EquationIdModalProps) {
  // modal state -> used to change the equationId
  const [modalValue, setModalValue] = useState<string>(props.equationId);
  const idAlreadyExists = useAppSelector(checkIfEquationIdExists(modalValue)) && modalValue !== props.equationId;

  const handleModalApply = () => {
    props.onClose(true, modalValue);
    setModalValue(props.equationId);
  };

  const handleModalCancel = () => {
    props.onClose(false, props.equationId);
  };

  return (
    <Dialog open={props.modalOpen} onClose={handleModalCancel} classes={{ paper: styles.modal }}>
      <DialogContent>
        <TextField
          autoFocus
          value={modalValue}
          error={idAlreadyExists}
          helperText={idAlreadyExists ? 'Variable with this name already exists.' : undefined}
          onChange={(e) => setModalValue(e.target.value)}
          margin="dense"
          id="name"
          label="Variable name"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalCancel}>Cancel</Button>
        <Button onClick={handleModalApply} disabled={idAlreadyExists}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
