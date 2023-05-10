import styles from './styles.module.css';
import VariableInput from './VariableInput';
import { VariableTable as VariableTableType } from 'redux/dataStore/userInterface/variableTable';

export interface VariableTableProps {
  content: VariableTableType;
}

export default function VariableTable({ content }: VariableTableProps) {
  return (
    <div className={styles.variableTable}>
      <div className={styles.tableHeader}>NAME</div>
      <div className={styles.tableHeader}>VALUE</div>
      {[...content.variableIds, undefined].map((_, index) => (
        <VariableInput index={index} variableTableId={content.id} key={`${content.id}-var-${index}`} />
      ))}
    </div>
  );
}
