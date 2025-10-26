import { Navigate, useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../hooks/useAuth";
import { LoadingState } from "../../components/ui";
export default function SignIn() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  if (loading) {
    return <LoadingState size="lg" text="Loading..." />;
  }
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | SpaceTechs - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for SpaceTechs - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
