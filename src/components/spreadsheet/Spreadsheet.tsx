import { range, range2d } from 'generalHelpers/numberHelper';
import CellInput from './CellInput';
import styles from './styles.module.css';
import { getSpreadsheetColumnLabel, getSpreadsheetRowLabel } from 'generalHelpers/stringHelper';
import { useAppSelector } from 'redux/hooks';
import { getContent } from 'redux/dataStore/userInterface/selectors';

export default function Spreadsheet({ contentId }: { contentId: string }) {
  const content = useAppSelector(getContent(contentId));
  if (content.type !== 'spreadsheet') return <div>ERROR</div>;

  return (
    <div className={styles.spreadsheet}>
      <div className={styles.tableCorner} />
      {range({ n: content.nColumns }).map((x) => (
        <div className={styles.tableColumnLabel} style={{ gridColumn: x + 2 }} key={`${content.id}-col-label-${x}`}>
          {getSpreadsheetColumnLabel({ index: x })}
        </div>
      ))}
      {range({ n: content.nRows }).map((y) => (
        <div className={styles.tableRowLabel} style={{ gridRow: y + 2 }} key={`${content.id}-col-label-${y}`}>
          {getSpreadsheetRowLabel({ index: y })}
        </div>
      ))}
      {range2d({ x: content.nColumns, y: content.nRows }).map(({ x, y }) => {
        return <CellInput rowIndex={y} columnIndex={x} spreadsheetId={content.id} key={`${content.id}-${x}-${y}`} />;
      })}
    </div>
  );
}
