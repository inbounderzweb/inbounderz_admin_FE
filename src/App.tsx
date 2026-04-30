import { useEffect } from 'react';
import { useAppStore } from './store/useStore';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import Careers from './pages/Careers';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const { activePage, isAuthenticated, user, isAuthLoading, checkAuth, setActivePage, darkMode } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Ensure dark mode class is applied to html on load from persisted state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Redirect users if they try to access pages they don't have permission for
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      const permissions = (user?.permissions as any) || {};
      
      // If the permission key for this page is completely missing, use default access fallback
      if (typeof permissions[activePage] === 'undefined') {
        const defaultAccess = ['dashboard', 'enquiries', 'careers'].includes(activePage);
        if (!defaultAccess) setActivePage('dashboard');
        return;
      }

      // If it's the old boolean format and it's false, redirect
      if (typeof permissions[activePage] === 'boolean') {
        if (permissions[activePage] === false && activePage !== 'dashboard') {
          setActivePage('dashboard');
        }
        return;
      }

      // If the page exists in granular permissions and 'view' is set to false, redirect to dashboard
      if (activePage !== 'dashboard' && permissions[activePage]?.view === false) {
        setActivePage('dashboard');
      }
    }
  }, [activePage, user, setActivePage, isAuthenticated]);

  // Loading state while checking token
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/5 border-t-blue-600 rounded-full" />
          <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">System Loading</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show Login or ForgotPassword
  if (!isAuthenticated) {
    if (activePage === 'forgot-password') return <ForgotPassword />;
    return <Login />;
  }

  // If we get here, user is authenticated
  // We should ensure activePage is not 'login' since they are authenticated
  if (activePage === 'login') {
    setActivePage('dashboard');
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'enquiries':
        return <Enquiries />;
      case 'careers':
        return <Careers />;
      case 'users':
        return <Users />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
