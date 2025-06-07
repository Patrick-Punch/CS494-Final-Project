'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { BoardGame } from '@/types/BoardGame';
interface UserSettings {
  bio: string;
  favoriteGame: string;
}

interface UserContextType {
  user: User | null;
  userSettings: UserSettings;
  gameShelf: BoardGame[];
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserSettings: (settings: UserSettings) => Promise<void>;
  updateGameShelf: (games: BoardGame[]) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    bio: '',
    favoriteGame: '',
  });
  const [gameShelf, setGameShelf] = useState<BoardGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await Promise.all([
          loadUserSettings(user.uid),
          loadGameShelf(user.uid),
        ]);
      } else {
        setUserSettings({
          bio: '',
          favoriteGame: '',
        });
        setGameShelf([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserSettings = async (userId: string) => {
    try {
      const docRef = doc(db, 'userSettings', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserSettings(docSnap.data() as UserSettings);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const loadGameShelf = async (userId: string) => {
    try {
      const docRef = doc(db, 'gameShelf', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGameShelf(docSnap.data().games || []);
      }
    } catch (error) {
      console.error('Error loading game shelf:', error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserSettings = async (settings: UserSettings) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'userSettings', user.uid);
      await setDoc(docRef, settings);
      setUserSettings(settings);
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  const updateGameShelf = async (games: BoardGame[]) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'gameShelf', user.uid);
      await setDoc(docRef, { games });
      setGameShelf(games);
    } catch (error) {
      console.error('Error updating game shelf:', error);
    }
  };

  const value: UserContextType = {
    user,
    userSettings,
    gameShelf,
    loading,
    loginWithGoogle,
    logout,
    updateUserSettings,
    updateGameShelf,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};