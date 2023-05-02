import { Button } from '@mui/material';
import { useState } from 'react';
import VariableInput from './VariableInput';
import styles from './styles.module.css';
import EquationIdModal from './EquationIdModal';
import { VariableTable as VariableTableContent } from 'redux/dataStore/userInterface/variableTable';

export default function VariableTable({ content }: { content: VariableTableContent }) {
  const [variableList, setVariableList] = useState<string[]>(content.variableIds);

  // state of new variables -> once the button is clicked, user can add a new variable name in the modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalClose = (success: boolean, newId: string) => {
    if (success) {
      // the user confirmed the new variable name by clicking the "Apply" button
      setVariableList([...variableList, newId]);
    }
    setModalOpen(false);
  };

  return (
    <div className={styles.variableListWrapper}>
      {variableList.map((id: string) => (
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
