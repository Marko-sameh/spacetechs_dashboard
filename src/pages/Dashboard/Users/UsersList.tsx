import React, { useState } from 'react';
import { useUsers } from '../../../hooks/useUsers';
import { useAuth } from '../../../hooks/useAuth';
import { User } from '../../../types/models';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import { Modal } from '../../../components/ui/modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/badge/Badge';
import Alert from '../../../components/ui/alert/Alert';
import { ListPageHeader } from '../../../components/common/ListPageHeader';
const UsersList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'superAdmin',
    gender: 'male' as 'male' | 'female',
    photo: '',
    password: '',
    passwordConfirm: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const { users, isLoading, error, createUser, updateUser, deleteUser, isCreating, isUpdating, isDeleting } = useUsers();
  const { user: currentUser } = useAuth();
  // Filter users based on search term and filters
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || (user.active !== undefined && user.active.toString() === statusFilter);
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm && !editingUser) {
      setAlert({ type: 'error', message: 'Passwords do not match' });
      setTimeout(() => setAlert(null), 5000);
      return;
    }
    try {
      if (editingUser) {
        const { password, passwordConfirm, ...updateData } = formData;
        void password; // Ignore password field for updates
        void passwordConfirm; // Ignore passwordConfirm field for updates
        await updateUser({ id: editingUser._id, data: updateData });
      } else {
        await createUser(formData);
      }
      setIsFormOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'admin', gender: 'male', photo: '', password: '', passwordConfirm: '' });
      setImagePreview(null);
      setAlert({ type: 'success', message: `User ${editingUser ? 'updated' : 'created'} successfully!` });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Operation failed:', error);
      setAlert({ type: 'error', message: 'Operation failed. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender || 'male',
      photo: user.photo || '',
      password: '',
      passwordConfirm: ''
    });
    setImagePreview(user.photo || null);
    setIsFormOpen(true);
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setDeleteConfirm(null);
      setAlert({ type: 'success', message: 'User deleted successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setAlert({ type: 'error', message: 'Failed to delete user. Please try again.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };
  if (currentUser?.role !== 'superAdmin') {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only Super Admin users can manage users.</p>
        </div>
      </div>
    );
  }
  if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;
  if (error) return <ErrorMessage message="Failed to load users" />;
  return (
    <div className="p-6">
      {alert && (
        <div className="mb-4">
          <Alert
            variant={alert.type}
            title={alert.type === 'success' ? 'Success' : 'Error'}
            message={alert.message}
          />
        </div>
      )}
      <ListPageHeader
        title="Users Management"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        filter1={{
          value: roleFilter,
          onChange: setRoleFilter,
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'superAdmin', label: 'Super Admin' }
          ],
          placeholder: 'All Roles'
        }}
        onAddClick={() => setIsFormOpen(true)}
        addButtonText="Add User"
      />
      {filteredUsers.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'No users found' : 'No users yet'}
          description={searchTerm ? `No users match "${searchTerm}"` : 'Create your first user to get started.'}
          action={{
            label: searchTerm ? 'Clear search' : 'Add User',
            onClick: searchTerm ? () => setSearchTerm('') : () => setIsFormOpen(true)
          }}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredUsers.map((user: User) => {
              const defaultPhoto = user.gender === 'female' 
                ? '/images/user/user-02.png' 
                : '/images/user/user-01.png';
              const userPhoto = user.photo || defaultPhoto;
              return (
                <tr key={user._id}>
                  <td className="px-6 py-4">
                    <img src={userPhoto} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge 
                      color={user.role === 'superAdmin' ? 'primary' : 'info'} 
                      variant="light"
                    >
                      {user.role === 'superAdmin' ? 'Super Admin' : 'Admin'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit user"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
          setFormData({ name: '', email: '', role: 'admin', gender: 'male', photo: '', password: '', passwordConfirm: '' });
          setImagePreview(null);
        }}
        className="max-w-md mx-4 p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingUser ? 'Edit User' : 'Add User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'superAdmin' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="superAdmin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64 = reader.result as string;
                      setFormData({ ...formData, photo: base64 });
                      setImagePreview(base64);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Photo preview" className="w-16 h-16 object-cover rounded-full" />
                </div>
              )}
            </div>
            {!editingUser && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required={!editingUser}
                    minLength={6}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required={!editingUser}
                    minLength={6}
                    placeholder="Confirm password"
                  />
                  {formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>
              </>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 "
              >
                {isCreating || isUpdating ? 'Processing...' : (editingUser ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        className="max-w-md mx-4 p-6"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
          <p className="mb-4">Are you sure you want to delete "{deleteConfirm?.name}"?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm._id)}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default UsersList;