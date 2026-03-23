import type { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import type { ParsedTable } from '../utils/parseMarkdownTable';
import {
  StyledTableContainer,
  StyledHeaderCell,
  StyledBodyCell,
} from '../RichBlocks.style';

interface TableRendererProps extends ParsedTable {}

export const TableRenderer: FC<TableRendererProps> = ({ headers, rows }) => (
  <StyledTableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <StyledHeaderCell key={`h-${index}`} component="th" scope="col">
              {header}
            </StyledHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={`r-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <StyledBodyCell key={`c-${rowIndex}-${cellIndex}`}>
                {cell}
              </StyledBodyCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </StyledTableContainer>
);
