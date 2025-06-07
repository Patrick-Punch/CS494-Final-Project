import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  useTheme,
  TableSortLabel,
} from '@mui/material';
import { useState } from 'react';

type BoardGame = {
  id: string;
  name: string;
  yearPublished?: number;
};

type BoardGameTableProps = {
  boardgames: BoardGame[];
  handleRemoveGame?: (id: string) => void;
};

type SortField = 'id' | 'name' | 'yearPublished' | null;
type SortOrder = 'asc' | 'desc';

export default function BoardGameTable({ boardgames, handleRemoveGame }: BoardGameTableProps) {
  const theme = useTheme();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedGames = [...boardgames].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'string' || typeof bValue === 'string') {
      const aStr = typeof aValue === 'string' ? aValue : String(aValue ?? '');
      const bStr = typeof bValue === 'string' ? bValue : String(bValue ?? '');
      return sortOrder === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  return (
    <TableContainer
      sx={{
        borderRadius: '10px',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <TableCell
              sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}
              sortDirection={sortField === 'id' ? sortOrder : false}
            >
              <TableSortLabel
                active={sortField === 'id'}
                direction={sortField === 'id' ? sortOrder : 'asc'}
                onClick={() => handleSort('id')}
                sx={{
                  color: theme.palette.primary.contrastText,
                  '& .MuiTableSortLabel-icon': { color: 'inherit' },
                }}
              >
                ID
              </TableSortLabel>
            </TableCell>

            <TableCell
              sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}
              sortDirection={sortField === 'name' ? sortOrder : false}
            >
              <TableSortLabel
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortOrder : 'asc'}
                onClick={() => handleSort('name')}
                sx={{
                  color: theme.palette.primary.contrastText,
                  '& .MuiTableSortLabel-icon': { color: 'inherit' },
                }}
              >
                Name
              </TableSortLabel>
            </TableCell>

            <TableCell
              sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}
              sortDirection={sortField === 'yearPublished' ? sortOrder : false}
            >
              <TableSortLabel
                active={sortField === 'yearPublished'}
                direction={sortField === 'yearPublished' ? sortOrder : 'asc'}
                onClick={() => handleSort('yearPublished')}
                sx={{
                  color: theme.palette.primary.contrastText,
                  '& .MuiTableSortLabel-icon': { color: 'inherit' },
                }}
              >
                Year Published
              </TableSortLabel>
            </TableCell>

            {handleRemoveGame && (
              <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedGames.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{game.id}</TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{game.name}</TableCell>
              <TableCell>{game.yearPublished || 'N/A'}</TableCell>
              {handleRemoveGame && (
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveGame(game.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}