import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { range } from 'generalHelpers/numberHelper';
import { getSpreadsheetColumnLabel, getSpreadsheetRowLabel } from 'generalHelpers/stringHelper';
import EquationInput from './EquationInput';

export interface SpreadsheetProps {
  initialRows: number;
  initialColumns: number;
}

export default function Spreadsheet({ initialRows, initialColumns }: SpreadsheetProps) {
  const [rowCount, setRowCount] = useState<number>(initialRows);
  const [columnCount, setColumnCount] = useState<number>(initialColumns);

  const columnLabels = range({ n: columnCount }).map((index) => getSpreadsheetColumnLabel({ index }));
  const rowLabels = range({ n: rowCount }).map((index) => getSpreadsheetRowLabel({ index }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} size="small" aria-label="spreadsheet table">
        <TableHead>
          <TableRow>
            <TableCell id="spreadsheetCorner" />
            {columnLabels.map((label) => (
              <TableCell key={`spreadsheetHeader${label}`} align="center">
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowLabels.map((rowLabel, rowIndex) => (
            <TableRow key={`spreadsheetRow${rowLabel}`}>
              <TableCell>{rowLabel}</TableCell>
              {columnLabels.map((columnLabel) => (
                <TableCell key={`spreadsheetCell${columnLabel}${rowLabel}`} align="center">
                  <EquationInput equationId={`${columnLabel}${rowLabel}`} style={{ padding: '0px' }} />
                </TableCell>
              ))}
              {rowIndex === 0 && (
                <TableCell rowSpan={rowCount}>
                  <Button onClick={() => setColumnCount(columnCount + 1)}>Add Column</Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={columnCount + 1} align="center">
              <Button onClick={() => setRowCount(rowCount + 1)}>Add Row</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
