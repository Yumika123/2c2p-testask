import React, { FunctionComponent } from 'react';
import { useTable } from 'react-table';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

export interface ITableCell
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  content?: string;
  contentStyle?: { [key: string]: string };
  renderCell?: (cell: ITableCell) => React.ReactNode;
  getCellProps?: () => { [key: string]: string };
}

interface ITableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  head: ITableColumn[];
  rows: ITableData[];
  hasPagination: boolean;
  currentPage?: number;
  pageSize?: number;
  count?: number;
  handleChangePage?: (event: object, page: number) => void;
}

export interface ITableColumn extends Partial<ITableCell> {
  accessor: string;
  Header?: string;
}
export interface ITableData {
  [key: string]: ITableCell;
}

export interface ITableCell
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  content?: string;
  contentStyle?: { [key: string]: string };
  renderCell?: (cell: ITableCell) => React.ReactNode;
  getCellProps?: () => { [key: string]: string };
}

const Table2C2P: FunctionComponent<ITableProps> = ({
  head: columns,
  rows: data,
  hasPagination,
  count,
  handleChangePage,
  currentPage = 0,
  pageSize = 5,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    getRowProps,
  } = useTable({ columns, data });

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);

          const rowProps = getRowProps
            ? row.getRowProps(getRowProps(row))
            : row.getRowProps();

          return (
            <TableRow {...rowProps}>
              {row.cells.map((cell, i) => {
                const { content, ...restCell } = cell.value;
                return (
                  <TableCell key={i}>
                    {restCell.renderCell ? (
                      restCell.renderCell(cell)
                    ) : (
                      <p {...restCell.contentStyle}>{content}</p>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
      {hasPagination && (
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={columns.length}
              count={count}
              rowsPerPage={pageSize}
              page={currentPage}
              onChangePage={handleChangePage}
              rowsPerPageOptions={[]}
            />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default Table2C2P;
