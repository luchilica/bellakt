import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './store/useAuthStore';
import { LoadingScreen } from './components/LoadingScreen';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import HealthJournal from './pages/HealthJournal';
import Canteen from './pages/Canteen';
import Services from './pages/Services';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Payslip from './pages/Payslip';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/health" element={<HealthJournal />} />
              <Route path="/canteen" element={<Canteen />} />
              <Route path="/services" element={<Services />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payslip" element={<Payslip />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
