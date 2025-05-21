import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Preloader from '@/components/Preloader'; 
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
  const { user, loading: authSessionLoading } = useAuth();
  const location = useLocation();
  
  if (authSessionLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-background min-h-[calc(100vh-var(--notification-bar-height,0px)-var(--footer-height,0px))]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const { user, loading: authSessionLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Calculate notification bar height (if visible)
    const notificationBar = document.getElementById('notification-bar');
    const notificationBarHeight = notificationBar ? notificationBar.offsetHeight : 0;
    document.documentElement.style.setProperty('--notification-bar-height', `${notificationBarHeight}px`);

    // Calculate footer height
    const footer = document.getElementById('app-footer');
    const footerHeight = footer ? footer.offsetHeight : 0;
    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
  }, [location.pathname]); // Recalculate on path change if layout affects these heights

  if (appLoading) {
    return <Preloader />;
  }

  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/success'];
  const isAuthPath = authPaths.some(path => location.pathname.startsWith(path));

  // Show a generic initializing screen if auth is loading, user is not yet available,
  // it's not an auth path, and the initial app preloader is done.
  // This covers the flicker between preloader and auth check completion.
  if (authSessionLoading && !user && !isAuthPath && !appLoading) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <NotificationBar /> {/* Keep consistent elements visible */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-xl text-muted-foreground">Initializing...</p>
        </div>
        <Footer /> {/* Keep consistent elements visible */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NotificationBar id="notification-bar" />
      <Toaster />
      <div className="flex-grow flex flex-col"> {/* This div ensures main content can grow */}
        <main className="flex-grow flex flex-col"> {/* Ensure main itself can be a flex container if needed by children */}
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
      <Footer id="app-footer" />
    </div>
  );
}

export default App;
