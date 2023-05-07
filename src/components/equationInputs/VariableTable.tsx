import { Button } from '@mui/material';
import { useState } from 'react';
import VariableInput from './VariableInput';
import styles from './styles.module.css';
import EquationIdModal from './EquationIdModal';
import { VariableTable as VariableTableContent } from 'redux/dataStore/userInterface/variableTable';
import { useAppDispatch } from 'redux/hooks';
import { addVariable } from 'redux/dataStore/dataSlice';

export default function VariableTable({ content }: { content: VariableTableContent }) {
  // state of new variables -> once the button is clicked, user can add a new variable name in the modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleModalClose = (success: boolean, newId: string) => {
    if (success) {
      // the user confirmed the new variable name by clicking the "Apply" button
      dispatch(addVariable({ equationId: newId, variableTableId: content.id }));
    }
    setModalOpen(false);
  };

  return (
    <div className={styles.variableListWrapper}>
      {content.variableIds.map((id: string) => (
        <VariableInput defaultEquationId={id} key={`variable-list-item-${id}`} />
      ))}
      <div className={styles.addVariableButton}>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add New Variable
        </Button>
      </div>
      <EquationIdModal equationId="" modalOpen={modalOpen} onClose={handleModalClose} />
    </div>
  );
}
