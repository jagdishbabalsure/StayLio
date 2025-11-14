import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // Check if we're on a page that needs a solid navbar background
  const needsSolidBackground = location.pathname === '/hotels' || location.pathname === '/auth' || location.pathname === '/about' || location.pathname === '/contact';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthRedirect = (mode) => {
    if (mode === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
    setIsOpen(false); // Close mobile menu if open
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '#hero', route: '/' },
    { name: 'About', href: '#about', route: '/about' },
    { name: 'Hotels', href: '#hotels', route: '/hotels' },
    { name: 'Contact', href: '#contact', route: '/contact' }
  ];

  const handleNavClick = (e, href, linkName, route) => {
    e.preventDefault();

    // Handle navigation to different pages
    if (linkName === 'Hotels') {
      navigate('/hotels');
      setIsOpen(false);
      return;
    }

    if (linkName === 'About') {
      navigate('/about');
      setIsOpen(false);
      return;
    }

    if (linkName === 'Contact') {
      navigate('/contact');
      setIsOpen(false);
      return;
    }

    // Handle Home navigation
    if (linkName === 'Home') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        // Scroll to top if already on home page
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      setIsOpen(false);
      return;
    }

    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const navbarHeight = 72;
          const targetPosition = targetElement.offsetTop - navbarHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // We're on home page, just scroll
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navbarHeight = 72;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsOpen(false); // Close mobile menu
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-out ${needsSolidBackground
      ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-gray-200'
      : isScrolled
        ? 'bg-white/80 backdrop-blur-2xl shadow-xl border-b border-white/20 navbar-blur'
        : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Enhanced Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-3 transform hover:scale-110 transition-all duration-500 cursor-pointer group relative font-['Inter']">
            <div className="relative">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:rotate-6 logo-icon relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <svg className="w-7 h-7 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              {/* Floating particles around logo */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            </div>

            <div className="relative">
              <h1 className={`text-2xl font-bold transition-all duration-500 ${needsSolidBackground || isScrolled ? 'text-slate-800' : 'text-white'
                } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:bg-clip-text`}>
                Staylio
              </h1>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.name, link.route)}
                  className={`relative px-5 py-3 text-sm font-semibold transition-all duration-500 hover:-translate-y-1 group rounded-xl cursor-pointer overflow-hidden font-['Inter'] ${needsSolidBackground || isScrolled
                    ? 'text-slate-700 hover:text-blue-600'
                    : 'text-white/90 hover:text-white'
                    }`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animation: 'slideInDown 0.8s ease-out forwards'
                  }}
                >
                  {/* Background hover effect */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-500 transform scale-0 group-hover:scale-100 ${needsSolidBackground || isScrolled
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100'
                    : 'bg-white/15 backdrop-blur-sm'
                    }`}></div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-500"></div>

                  {/* Text with icon */}
                  <div className="relative flex items-center space-x-2">
                    <span>{link.name}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Bottom indicator */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 group-hover:w-8 rounded-full"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`group relative px-4 py-3 text-sm font-semibold transition-all duration-500 rounded-xl border-2 overflow-hidden font-['Inter'] ${needsSolidBackground || isScrolled
                    ? 'text-slate-700 hover:text-blue-600 border-gray-200 hover:border-blue-300'
                    : 'text-white border-white/40 hover:border-white'
                    } transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3`}
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <span className="hidden lg:block">
                    Hi, {user?.firstName}
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Dashboard</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>My Bookings</span>
                      </button>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleAuthRedirect('login')}
                  className={`group relative px-6 py-3 text-sm font-semibold transition-all duration-500 rounded-xl border-2 overflow-hidden font-['Inter'] ${needsSolidBackground || isScrolled
                    ? 'text-slate-700 hover:text-blue-600 border-gray-200 hover:border-blue-300'
                    : 'text-white border-white/40 hover:border-white'
                    } transform hover:scale-105 hover:-translate-y-1`}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 transition-all duration-500 transform scale-0 group-hover:scale-100 ${needsSolidBackground || isScrolled
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100'
                    : 'bg-white/15 backdrop-blur-sm'
                    }`}></div>

                  {/* Floating particles */}
                  <div className="absolute top-1 right-2 w-1 h-1 bg-current rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping"></div>

                  <span className="relative flex items-center space-x-2">
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </span>
                </button>

                <button
                  onClick={() => handleAuthRedirect('signup')}
                  className="group relative bg-blue-600 text-white px-7 py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-100 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2 overflow-hidden font-['Inter']"
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {/* Floating particles */}
                  <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-70"></div>
                  <div className="absolute bottom-2 right-3 w-0.5 h-0.5 bg-white rounded-full animate-ping opacity-50"></div>

                  <div className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-15 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="tracking-wide">Sign Up</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`group relative p-3 rounded-2xl transition-all duration-500 transform hover:scale-110 ${needsSolidBackground || isScrolled
                ? 'hover:bg-blue-50 text-slate-700 hover:text-blue-600'
                : 'hover:bg-white/15 text-white backdrop-blur-sm'
                } ${isOpen ? 'rotate-180 scale-110' : ''}`}
            >
              {/* Background pulse effect */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${isOpen ? 'bg-blue-100 scale-110' : 'scale-0'
                }`}></div>

              {/* Animated hamburger/close icon */}
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                  }`}></span>
                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1.5'
                  }`}></span>
              </div>

              {/* Floating indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white/80 backdrop-blur-xl border-t border-gray-200/30 shadow-lg navbar-glass`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href, link.name, link.route)}
              className="block px-4 py-3 text-slate-700 hover:text-blue-600 text-base font-medium transition-all duration-300 rounded-xl hover:bg-blue-50 transform hover:translate-x-2 cursor-pointer font-['Inter']"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: isOpen ? 'slideUp 0.4s ease-out forwards' : ''
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span>{link.name}</span>
              </div>
            </a>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-200 space-y-3">
            <button
              onClick={() => handleAuthRedirect('login')}
              className="block w-full text-left px-4 py-3 text-slate-700 hover:text-blue-600 text-base font-medium rounded-xl hover:bg-blue-50 transition-all duration-300 font-['Inter']"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </div>
            </button>
            <button
              onClick={() => handleAuthRedirect('signup')}
              className="mx-2 w-[calc(100%-1rem)] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-['Inter']"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;