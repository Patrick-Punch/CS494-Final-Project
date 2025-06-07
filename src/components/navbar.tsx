'use client';

import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { useUserContext } from '@/context/userContext';

const Navbar: React.FC = () => {
  const { user, loginWithGoogle, logout } = useUserContext();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Virtual Game Shelf
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Avatar 
                src={user.photoURL || undefined} 
                alt={user.displayName || 'User'}
                sx={{ width: 32, height: 32 }}
              />
              <Link href="/profile" passHref>
                <Button component="a" color="inherit">
                  Profile
                </Button>
              </Link>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={loginWithGoogle}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;