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
      setError('Authentication required');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await UserService.getUsers(params);
      setUsers(response.data.users);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Users fetch error:', err);
      const errorMessage = err?.response?.status === 500 
        ? 'Server error - please try again later'
        : err?.message || 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  const addUser = async (user: CreateUserData) => {
    try {
      const newUser = await UserService.createUser(user);
      setUsers(prev => [...prev, newUser]);
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to create user');
    }
  };
  const editUser = async (id: string, user: Partial<CreateUserData>) => {
    try {
      const updatedUser = await UserService.updateUser(id, user);
      setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to update user');
    }
  };
  const removeUser = async (id: string) => {
    try {
      await UserService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to delete user');
    }
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