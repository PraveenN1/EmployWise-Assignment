import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';

const App = () => {
  const { authToken } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!authToken ? <LoginPage /> : <Navigate to="/users" />} />
      <Route path="/users" element={authToken ? <UsersPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={authToken ? "/users" : "/login"} />} />
    </Routes>
  );
};

export default App;
