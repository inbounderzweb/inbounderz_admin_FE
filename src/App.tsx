import { useEffect } from 'react';
import { useAppStore } from './store/useStore';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import Careers from './pages/Careers';
import Users from './pages/Users';
import Login from './pages/Login';

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

  // If not authenticated, always show Login regardless of activePage
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated but role is not admin, show access restricted
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 font-['Syne']">Access Restricted</h1>
        <p className="text-white/50 max-w-md text-sm leading-relaxed">
          This portal is reserved for administrators. Your account <span className="text-[#f5c842] font-medium">{user?.email}</span> does not have the required permissions.
        </p>
        <button 
          onClick={() => useAppStore.getState().logout()}
          className="mt-8 px-8 py-3 bg-[#f5c842] hover:bg-[#e8752a] text-black rounded-xl text-sm font-bold transition-all transform active:scale-95"
        >
          Logout & Switch Account
        </button>
      </div>
    );
  }

  // If we get here, user is authenticated and is an admin
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
