import { useAuth } from "../hooks/useAuth";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import Alert from "../components/ui/alert/Alert";
import Avatar from "../components/ui/avatar/Avatar";
import { useState } from "react";

export default function UserProfiles() {
  const { user, updateProfile, updatePhoto, deletePhoto, updatePassword, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
  });
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updatePhoto(file);
      } catch (error) {
        console.error('Photo upload failed:', error);
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await deletePhoto();
    } catch (error) {
      console.error('Photo deletion failed:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.passwordConfirm) {
      setAlert({ type: 'error', message: 'New passwords do not match' });
      setTimeout(() => setAlert(null), 5000);
      return;
    }
    try {
      await updatePassword(passwordData);
      setIsChangingPassword(false);
      setPasswordData({ passwordCurrent: '', password: '', passwordConfirm: '' });
      setAlert({ type: 'success', message: 'Password updated successfully!' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Password update failed:', error);
      setAlert({ type: 'error', message: 'Password update failed. Please check your current password.' });
      setTimeout(() => setAlert(null), 5000);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const defaultPhoto = user.gender === 'female' 
    ? '/images/user/user-02.png' 
    : '/images/user/user-01.png';
  
  const userPhoto = user.photo || defaultPhoto;

  return (
    <>
      <PageMeta
        title="Profile | SpaceTechs - React.js Admin Dashboard"
        description="User Profile Management"
      />
      <PageBreadcrumb pageTitle="Profile" />
      
      
      {alert && (
        <div className="mb-4">
          <Alert
            variant={alert.type}
            title={alert.type === 'success' ? 'Success' : 'Error'}
            message={alert.message}
          />
        </div>
      )}
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        
        <div className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar
                src={userPhoto}
                alt={user.name}
                size="xxlarge"
                className="border-4 border-gray-200 dark:border-gray-700"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
<div className="space-y-2 w-full">
  <div className="flex justify-between items-center">
    {/* زر الشمال */}
    <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
      Upload Photo
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        disabled={loading}
      />
    </label>

    {/* زر اليمين */}

  </div>
</div>

          </div>

          {/* Profile Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary-600 hover:text-primary-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h4>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-primary-600 hover:text-primary-700"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.passwordCurrent}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordCurrent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.passwordConfirm}
                    onChange={(e) => setPasswordData({ ...passwordData, passwordConfirm: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      passwordData.password && passwordData.passwordConfirm && passwordData.password !== passwordData.passwordConfirm
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    minLength={6}
                    required
                  />
                  {passwordData.password && passwordData.passwordConfirm && passwordData.password !== passwordData.passwordConfirm && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ passwordCurrent: '', password: '', passwordConfirm: '' });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Click "Change Password" to update your password securely.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
