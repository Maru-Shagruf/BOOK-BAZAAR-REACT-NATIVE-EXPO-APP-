import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const AUTH_KEY = 'cbe_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY)
      .then((value) => {
        if (value) setUser(JSON.parse(value));
      })
      .finally(() => setReady(true));
  }, []);

  async function login(userData) {
    setUser(userData);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  const value = { user, ready, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
