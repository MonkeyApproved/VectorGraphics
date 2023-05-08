import { CSSProperties, useState } from 'react';
import { InputLabel } from '@mui/material';
import EquationInput from './EquationInput';
import EquationIdModal from './EquationIdModal';
import styles from './styles.module.css';
import { useAppDispatch } from 'redux/hooks';
import { renameVariable } from 'redux/dataStore/dataSlice';

export interface VariableInputProps {
  defaultEquationId: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function VariableInput(props: VariableInputProps) {
  // equation id state (can be modified by click on text which opens a modal)
  const [equationId, setEquationId] = useState<string>(props.defaultEquationId);

  // modal state -> used to change the equationId
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleModalClose = (success: boolean, newId: string) => {
    if (success) {
      // the user confirmed the new variable name by clicking the "Apply" button
      dispatch(renameVariable({ oldId: equationId, newId: newId }));
      setEquationId(newId);
    }
    setModalOpen(false);
  };

  return (
    <>
      <InputLabel
        className={styles.variableInputLabel}
        onClick={() => setModalOpen(true)}
        htmlFor={`equation-input-${equationId}`}
      >
        {equationId}
      </InputLabel>

      <EquationInput equationId={equationId} />
      <EquationIdModal equationId={equationId} modalOpen={modalOpen} onClose={handleModalClose} />
    </>
  );
}
