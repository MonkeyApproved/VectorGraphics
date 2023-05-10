import { DataExplorer as DataExplorerType } from 'redux/dataStore/userInterface/dataExplorer';
import styles from './styles.module.css';

export interface DataExplorerProps {
  content: DataExplorerType;
}

export default function DataExplorer({ content }: DataExplorerProps) {
  return <div>Data Explorer</div>;
}
