import { useAuth } from '../../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import { LoadingState } from '../ui';
import { useEffect, useState } from 'react';
interface AuthGuardProps {
  children: React.ReactNode;
}
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading, token } = useAuth();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    // Wait a moment for auth initialization
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);
  if (loading || !isInitialized) {
    return <LoadingState size="lg" text="Authenticating..." />;
  }
  if (!isAuthenticated || !token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}