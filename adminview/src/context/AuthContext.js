'use client';

import { createContext, useState, useContext, useEffect } from 'react';
// Fix: Import directly from default export
import users from '@/data/usersData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Check if user is logged in from localStorage
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error reading from localStorage', error);
      }
      setLoading(false);
    }
  }, []);

  const login = (username, password, role) => {
    // Find user with matching credentials from JS data
    const foundUser = users.find(
      user => user.username === username && 
              user.password === password && 
              user.role === role
    );

    if (foundUser) {
      // Create a safe user object without the password
      const safeUserData = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        fullName: foundUser.fullName,
        department: foundUser.department
      };
      
      // Save user data to state and localStorage
      setUser(safeUserData);
      
      // Only access localStorage on the client
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('user', JSON.stringify(safeUserData));
        } catch (error) {
          console.error('Error writing to localStorage', error);
        }
      }
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    
    // Only access localStorage on the client
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Error removing from localStorage', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
