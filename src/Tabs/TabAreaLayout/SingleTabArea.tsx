import TabArea from '../TabArea';
import styles from './styles.module.css';

export default function SingleTabArea() {
  return (
    <div className={styles.single} style={{ gridArea: 'tabAreas' }}>
      <TabArea gridArea="single" />
    </div>
  );
}
