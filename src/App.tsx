import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AppProvider } from "./context/AppProvider";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { LoadingState } from "./components/ui";
import { useAuthStore } from "./store/authStore";
// Lazy load components for better performance
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const AppLayout = lazy(() => import("./layout/AppLayout"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const ProjectsList = lazy(() => import("./pages/Dashboard/Projects/ProjectsList"));
const CategoriesList = lazy(() => import("./pages/Dashboard/Categories/CategoriesList"));
const BlogsList = lazy(() => import("./pages/Dashboard/Blogs/BlogsList"));
const UsersList = lazy(() => import("./pages/Dashboard/Users/UsersList"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Blank = lazy(() => import("./pages/Blank"));
export default function App() {
  const initialize = useAuthStore(state => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <Router>
      <AppProvider>
        <ScrollToTop />
        <Suspense fallback={<LoadingState size="lg" text="Loading application..." />}>
          <Routes>
            {/* Auth Routes - No Guard */}
            <Route path="/signin" element={<SignIn />} />
            {/* Protected Routes */}
            <Route path="/*" element={
              <AuthGuard>
                <Suspense fallback={<LoadingState size="md" text="Loading page..." />}>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route index path="/" element={<Home />} />
                      <Route path="/projects" element={<ProjectsList />} />
                      <Route path="/categories" element={<CategoriesList />} />
                      <Route path="/blogs" element={<BlogsList />} />
                      <Route path="/users" element={<UsersList />} />
                      <Route path="/profile" element={<UserProfiles />} />
                      <Route path="/blank" element={<Blank />} />
                    </Route>
                  </Routes>
                </Suspense>
              </AuthGuard>
            } />
          </Routes>
        </Suspense>
      </AppProvider>
    </Router>
  );
}
