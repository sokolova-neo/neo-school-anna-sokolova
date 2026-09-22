import { styled } from '@mui/material/styles';
import MuiTableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { ChevronUp } from '@neofinancial/morpheus-icons';
import { type Column, Order } from '../../types/table';

const Head = styled(MuiTableHead)(({ theme }) => ({
  background: theme.palette.neutralSubtle.main,
}));

export interface TableHeadProps<T> {
  columns: Column<T>[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: Order;
  orderBy: keyof T;
}

export default function TableHead<T>({
  order,
  orderBy,
  onRequestSort,
  columns,
}: TableHeadProps<T>) {
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <Head>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.label}
            align="left"
            padding="normal"
            sortDirection={orderBy === column.key && order}
          >
            <TableSortLabel
              IconComponent={ChevronUp}
              active={orderBy === column.key}
              direction={orderBy === column.key ? order : Order.ASC}
              onClick={createSortHandler(column.key)}
              sx={{ fontWeight: 'bold' }}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </Head>
  );
}
