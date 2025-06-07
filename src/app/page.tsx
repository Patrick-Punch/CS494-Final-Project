'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import Navbar from '@/components/navbar';
import { useUserContext } from '@/context/userContext';
import BoardGameTable from '@/components/boardGameTable';
import { BoardGame } from '@/types/BoardGame'

export default function Home() {
  const { user, loading, gameShelf, updateGameShelf } = useUserContext();

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<BoardGame[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(gameShelf.length / itemsPerPage);
  const paginatedGames = gameShelf.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [searchPage, setSearchPage] = useState(1);
  const searchItemsPerPage = 10;
  const totalSearchPages = Math.ceil(searchResults.length / searchItemsPerPage);
  const paginatedSearchResults = searchResults.slice(
    (searchPage - 1) * searchItemsPerPage,
    searchPage * searchItemsPerPage
  );

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setSearching(true);
    setShowSearchResults(true);
    setSearchPage(1);
    try {
      const res = await fetch(`/api/bgg?search=${encodeURIComponent(searchInput)}`);
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddGame = (game: BoardGame) => {
    if (gameShelf.find((g) => g.id === game.id)) return;
    const updated = [...gameShelf, game];
    updateGameShelf(updated);
    setCurrentPage(1);
  };

  const handleRemoveGame = (id: string) => {
    const updated = gameShelf.filter((g) => g.id !== id);
    updateGameShelf(updated);
    if (currentPage > Math.ceil(updated.length / itemsPerPage)) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          {user ? (
            <>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontFamily: '"Baloo 2", cursive',
                  fontWeight: '700',
                  color: '#7B3F00',
                  letterSpacing: '2px',
                  mt: 4,
                  mb: 3,
                }}
              >
                My Game Shelf:
              </Typography>

              <Box mt={3} mb={2} display="flex" justifyContent="center" gap={2}>
                <TextField
                  label="Search for a game"
                  variant="outlined"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ width: '60%' }}
                />
                <Button variant="contained" onClick={handleSearch}>
                  Search
                </Button>
              </Box>

              {searching && (
                <Box mt={2}>
                  <CircularProgress />
                </Box>
              )}

              {searchResults.length > 0 && showSearchResults && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 4,
                    textAlign: 'left',
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      Search Results
                    </Typography>
                    <Button size="small" onClick={() => setShowSearchResults(false)}>
                      Hide
                    </Button>
                  </Box>
                  <List>
                    {paginatedSearchResults.map((game) => (
                      <ListItem
                        key={game.id}
                        secondaryAction={
                          <Button
                            variant="outlined"
                            onClick={() => handleAddGame(game)}
                            size="small"
                          >
                            Add
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={game.name}
                          secondary={game.yearPublished ? `Published: ${game.yearPublished}` : 'Year unknown'}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {searchResults.length > searchItemsPerPage && (
                    <Box mt={1} display="flex" justifyContent="center" gap={2}>
                      <Button
                        disabled={searchPage === 1}
                        onClick={() => setSearchPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <Typography sx={{ mt: 1 }}>
                        Page {searchPage} of {totalSearchPages}
                      </Typography>
                      <Button
                        disabled={searchPage === totalSearchPages}
                        onClick={() => setSearchPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {gameShelf.length === 0 ? (
                <Typography mt={4}>Your shelf is empty</Typography>
              ) : (
                <Box mt={4}>
                  <BoardGameTable boardgames={paginatedGames} handleRemoveGame={handleRemoveGame} />

                  {gameShelf.length > itemsPerPage && (
                    <Box mt={2} display="flex" justifyContent="center" gap={2}>
                      <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <Typography sx={{ mt: 1 }}>
                        Page {currentPage} of {totalPages}
                      </Typography>
                      <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to the Virtual Game Shelf! Please log in!
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}