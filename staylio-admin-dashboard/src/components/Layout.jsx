import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Users,
  Building2,
  UserCheck,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Hotel,
  BarChart3,
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout, isAdmin, isHost } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ];

    if (isAdmin) {
      return [
        ...baseItems,
        { name: 'Hosts Management', href: '/hosts', icon: Building2 },
        { name: 'Admins Management', href: '/admins', icon: UserCheck },
        { name: 'Users Management', href: '/users', icon: Users },
        { name: 'Hotels Management', href: '/hotels', icon: Hotel },
      ];
    } else if (isHost) {
      return [
        ...baseItems,
        { name: 'My Hotels', href: '/my-hotels', icon: Hotel },
        { name: 'Bookings', href: '/bookings', icon: Users },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Profile', href: '/profile', icon: Settings },
      ];
    }

    return baseItems;
  };

  const navigation = getNavigationItems();

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b ${isAdmin ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-emerald-900 via-emerald-800 to-emerald-900'} shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${isAdmin ? 'bg-blue-600' : 'bg-emerald-600'} rounded-xl flex items-center justify-center shadow-lg`}>
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Staylio</span>
              <p className="text-xs text-white/70 capitalize">{user?.role} Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${isAdmin ? 'bg-blue-500' : 'bg-emerald-500'} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-white/70 text-sm">{user?.email}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                isAdmin ? 'bg-blue-500/20 text-blue-200' : 'bg-emerald-500/20 text-emerald-200'
              }`}>
                {user?.role === 'admin' ? '👑 Administrator' : '🏨 Host Manager'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const current = isCurrentPath(item.href);
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  current
                    ? `${isAdmin ? 'bg-blue-600' : 'bg-emerald-600'} text-white shadow-lg transform scale-105`
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`mr-4 h-5 w-5 ${current ? 'text-white' : 'text-white/70'}`} />
                {item.name}
                {current && (
                  <div className={`ml-auto w-2 h-2 ${isAdmin ? 'bg-blue-300' : 'bg-emerald-300'} rounded-full`}></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-white/80 rounded-xl hover:text-white hover:bg-red-500/20 transition-all duration-200"
          >
            <LogOut className="mr-4 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search hotels, users, bookings..."
                    className="block w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-8 h-8 ${isAdmin ? 'bg-blue-100' : 'bg-emerald-100'} rounded-lg flex items-center justify-center`}>
                    <span className={`${isAdmin ? 'text-blue-600' : 'text-emerald-600'} font-semibold text-sm`}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;