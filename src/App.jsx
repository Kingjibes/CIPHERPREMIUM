import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import FreeServicesPage from '@/pages/FreeServicesPage';
import PurchasePlansPage from '@/pages/PurchasePlansPage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import SuccessPage from '@/pages/SuccessPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotificationBar from '@/components/NotificationBar';
import Footer from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { user, loading } = useAuth();

  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/success'];
  const isAuthPath = authPaths.some(path => window.location.pathname.startsWith(path));

  if (loading && !user && !isAuthPath) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NotificationBar />
      <Toaster />
      <div className="flex-grow flex flex-col"> {/* Added flex flex-col here */}
        <main className="flex-grow"> {/* This main wraps all routes */}
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
            <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPasswordPage />} />
            <Route path="/reset-password" element={user ? <Navigate to="/" /> : <ResetPasswordPage />} />
            <Route path="/success" element={<SuccessPage />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="free-services" element={<FreeServicesPage />} />
              <Route path="purchase-plans" element={<PurchasePlansPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
