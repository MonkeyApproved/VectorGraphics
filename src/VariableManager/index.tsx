import { useAppSelector, getVariableManager } from 'src/redux/selectors';
import styles from './styles.module.css';
import VariableInput from './VariableInput';
import NewVariableInput from './NewVariableInput';

export default function VariableManager({ managerId }: { managerId: string }) {
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
      <NewVariableInput managerId={managerId} index={manager.variables.length} />
    </div>
  );
}
