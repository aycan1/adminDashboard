import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface PaginatedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onRowClick?: (row: T) => void;
}

export const PaginatedTable = <T extends {}>({
  columns,
  data,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick
}: PaginatedTableProps<T>) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={String(column.id)}
                align={column.id === 'actions' ? 'right' : 'left'}
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  borderBottom: '2px solid rgba(224, 224, 224, 1)',
                  py: 2
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              hover
              key={index}
              onClick={() => onRowClick?.(row)}
              sx={{ 
                cursor: onRowClick ? 'pointer' : 'default',
                '&:last-child td, &:last-child th': { border: 0 }
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.id === 'actions' ? 'right' : 'left'}
                >
                  {column.render 
                    ? column.render(row[column.id], row)
                    : String(row[column.id])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Rows per page:"
      />
    </TableContainer>
  );
}; 