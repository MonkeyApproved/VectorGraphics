import { DataExplorer as DataExplorerType } from 'redux/dataStore/userInterface/dataExplorer';
import styles from './styles.module.css';

export interface DataExplorerProps {
  content: DataExplorerType;
}

function TableRow({ key }: { key: string }) {
  return (
    <>
      <div key={`variable-name-${key}`} className={styles.inputWrapper}>
        <div className={styles.result}>test</div>
        <input className={styles.input}></input>
      </div>
      <div key={`variable-value-${key}`} className={styles.inputWrapper}>
        <div className={styles.result}></div>
        <input className={styles.input}></input>
      </div>
    </>
  );
}

export default function DataExplorer({ content }: DataExplorerProps) {
  return (
    <div className={styles.variableTable}>
      <div className={styles.tableHeader}>NAME</div>
      <div className={styles.tableHeader}>VALUE</div>
      {[...Array(10)].map((_, i) => (
        <TableRow key={String(i)} />
      ))}
    </div>
  );
}
