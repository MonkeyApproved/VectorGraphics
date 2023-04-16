import { getSelectedElementIds } from 'redux/dataStore/svg/selectors';
import { useAppSelector } from 'redux/hooks';
import CoordinateInput from './CoordinateInput';
import styles from './ElementSettings.module.css';

export default function ElementSettings() {
  const elementIds = useAppSelector(getSelectedElementIds);

  return (
    <>
      {elementIds.map((id) => (
        <div key={`element_settings_${id}`} className={styles.elementSettings}>
          <span>{id}</span>
          <CoordinateInput elementId={id} type="position" />
          <CoordinateInput elementId={id} type="size" />
        </div>
      ))}
    </>
  );
}
