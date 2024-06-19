import { useAppSelector } from 'src/redux/hooks';
import styles from './styles.module.css';
import VariableInput from './VariableInput';
import { getVariableManager } from 'src/redux';

export default function VariableTable({ managerId }: { managerId: string }) {
  const manager = useAppSelector(getVariableManager({ managerId }));

  const tableRows = manager.variables.map((variableName, index) => {
    const key = `${manager.id}-row-${variableName}`;
    return <VariableInput variableName={variableName} index={index} key={key} />;
  });

  return (
    <div className={styles.variableTable} id={manager.id}>
      <div className={styles.tableHeader}>NAME</div>
      <div className={styles.tableHeader}>VALUE</div>
      {tableRows}
    </div>
  );
}
