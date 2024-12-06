import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || null);

  const login = (token) => {
    localStorage.setItem('auth_token', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
