import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { Layout } from '@/components/layout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { LoadingSpinner } from '@/components/ui/loading';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const OrganizationsPage = lazy(() => import('@/pages/organizations/OrganizationsPage').then(m => ({ default: m.OrganizationsPage })));
const BuildingsPage = lazy(() => import('@/pages/buildings/BuildingsPage').then(m => ({ default: m.BuildingsPage })));
const RoomsPage = lazy(() => import('@/pages/rooms/RoomsPage').then(m => ({ default: m.RoomsPage })));
const BookingsPage = lazy(() => import('@/pages/bookings/BookingsPage').then(m => ({ default: m.BookingsPage })));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AppContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="organizations" element={<OrganizationsPage />} />
          <Route path="organizations/:organizationId/buildings" element={<BuildingsPage />} />
          <Route path="organizations/:organizationId/rooms" element={<RoomsPage />} />
          <Route path="organizations/:organizationId/bookings" element={<BookingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return <AppContent />;
}