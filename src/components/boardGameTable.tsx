import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  useTheme,
} from '@mui/material';

type BoardGame = {
  id: string;
  name: string;
  yearPublished?: number;
};

type BoardGameTableProps = {
  boardgames: BoardGame[];
  handleRemoveGame?: (id: string) => void;
};

export default function BoardGameTable({ boardgames, handleRemoveGame }: BoardGameTableProps) {
  const theme = useTheme();

  const headers = ["ID", "Name", "Year Published", handleRemoveGame ? "Actions" : ""];

  return (
    <TableContainer
    sx={{
      borderRadius: '10px',
      border: `1px solid ${theme.palette.divider}`,
    }}>
      <Table>
        <TableHead>
        <TableRow
            sx={{
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {headers.map((header, i) => (
              <TableCell
                key={i}
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {boardgames.map((game) => (
            <TableRow key={game.id}>
              <TableCell>{game.id}</TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>{game.name}</TableCell>
              <TableCell>{game.yearPublished || "N/A"}</TableCell>
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