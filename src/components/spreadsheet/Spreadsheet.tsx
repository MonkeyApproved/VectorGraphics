import { range, range2d } from 'generalHelpers/numberHelper';
import { Spreadsheet as SpreadsheetContent } from 'redux/dataStore/userInterface/spreadsheet';
import CellInput from './CellInput';
import styles from './styles.module.css';
import { getSpreadsheetColumnLabel, getSpreadsheetRowLabel } from 'generalHelpers/stringHelper';

export default function Spreadsheet({ content }: { content: SpreadsheetContent }) {
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
