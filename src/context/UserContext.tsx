import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserService } from '../services/userService';
import { User, CreateUserData, QueryParams } from '../types/models';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    limit: number;
    totalPages: number;
  };
  addUser: (user: CreateUserData) => Promise<void>;
  editUser: (id: string, user: Partial<CreateUserData>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  refreshUsers: (params?: QueryParams) => Promise<void>;
  getUser: (id: string) => Promise<User>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ currentPage: number; limit: number; totalPages: number }>();

  const fetchUsers = async (params: QueryParams = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await UserService.getUsers(params);
      setUsers(response.data.users);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error('Users fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: CreateUserData) => {
    const newUser = await UserService.createUser(user);
    setUsers(prev => [...prev, newUser]);
  };

  const editUser = async (id: string, user: Partial<CreateUserData>) => {
    const updatedUser = await UserService.updateUser(id, user);
    setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
  };

  const removeUser = async (id: string) => {
    await UserService.deleteUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const getUser = async (id: string): Promise<User> => {
    return await UserService.getUser(id);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsers();
    }
  }, []);

  return (
    <UserContext.Provider value={{
      users,
      loading,
      error,
      pagination,
      addUser,
      editUser,
      removeUser,
      refreshUsers: fetchUsers,
      getUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export { UserContext };