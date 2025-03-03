import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white dark:text-gray-300" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Kanban Board</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <a
                href="/"
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700"
              >
                <LayoutDashboard className="mr-3 h-6 w-6 text-indigo-500 dark:text-indigo-300" />
                Dashboard
              </a>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-700">
                  <span className="text-indigo-600 dark:text-indigo-200 text-lg font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {user?.name || 'User'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Kanban Board</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <a
                href="/"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700"
              >
                <LayoutDashboard className="mr-3 h-6 w-6 text-indigo-500 dark:text-indigo-300" />
                Dashboard
              </a>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-700">
                <span className="text-indigo-600 dark:text-indigo-200 text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'User'}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center"
                >
                  <LogOut className="mr-1 h-3 w-3" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;