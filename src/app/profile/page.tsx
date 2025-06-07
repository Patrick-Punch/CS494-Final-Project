'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import Navbar from '@/components/navbar';
import { useUserContext } from '@/context/userContext';

export default function Profile() {
  const { user, userSettings, loading, updateUserSettings } = useUserContext();
  const [editMode, setEditMode] = useState(false);
  const [editSettings, setEditSettings] = useState({
    bio: '',
    favoriteGame: '',
  });

  const handleEditClick = () => {
    setEditSettings(userSettings);
    setEditMode(true);
  };

  const handleSave = async () => {
    await updateUserSettings(editSettings);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditSettings(userSettings);
    setEditMode(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Please log in to view your profile.
            </Typography>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName || 'User'}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              {user.displayName}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Profile Information
              </Typography>
              {!editMode && (
                <Button variant="outlined" startIcon={<Edit />} onClick={handleEditClick}>
                  Edit
                </Button>
              )}
            </Box>

            {editMode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Bio"
                  value={editSettings.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <TextField
                  label="Favorite Game"
                  value={editSettings.favoriteGame}
                  onChange={(e) => handleInputChange('favoriteGame', e.target.value)}
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Bio:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {userSettings.bio || 'No bio provided.'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Favorite Game:
                  </Typography>
                  <Typography variant="body1">
                    {userSettings.favoriteGame || 'No favorite game listed.'}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}