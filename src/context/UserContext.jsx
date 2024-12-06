import React, { createContext, useState, useContext, useCallback } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(page);
      setUsers(data.data);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        )
      );
      return updatedUser;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{
      users,
      totalPages,
      currentPage,
      loading,
      error,
      fetchUsers,
      updateUser,
      deleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};