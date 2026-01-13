import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/services', label: 'Services' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/booking-history', label: 'History' },
  { to: '/admin', label: 'Admin' },
  { to: '/management', label: 'Management' }
];

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/40">
            <span className="text-xl font-bold">P</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              EasyPark
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Smart Parking
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-0.5 rounded-full glass-iridescent px-1.5 py-1.5 text-sm md:flex shadow-2xl">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative px-5 py-2.5 rounded-full transition-all duration-300 z-10 ${
                  isActive || location.pathname === item.to
                    ? 'text-slate-900 dark:text-white font-semibold bg-white/90 dark:bg-slate-700/90 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/30 dark:hover:bg-slate-700/30'
                }`
              }
            >
              {({ isActive }) => {
                return (
                  <span className="relative whitespace-nowrap">
                    {item.label}
                  </span>
                );
              }}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden glass-button p-2 rounded-lg"
          aria-label="Toggle mobile menu"
        >
          <motion.div
            animate={{ rotate: showMobileMenu ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.div>
        </button>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 glass-button px-3 py-2 rounded-full hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300"
              >
                <img
                  src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                  alt={user?.name || 'User'}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 glass-modal rounded-xl shadow-lg z-50"
                >
                  <div className="p-3 border-b border-white/20 dark:border-white/10">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="glass-button px-4 py-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 rounded-full text-white font-medium shadow-lg shadow-primary-500/40 hover:scale-105 transition-all duration-300"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-800 p-1 text-xs shadow-inner shadow-black/10 dark:shadow-black/40 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md shadow-primary-500/40 ${
                isDark ? 'translate-x-0' : 'translate-x-6'
              }`}
            >
              <span className="text-xs">{isDark ? '☾' : '☀'}</span>
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden glass-iridescent mx-4 mt-3 rounded-2xl shadow-2xl"
        >
          <div className="p-3 space-y-1 relative z-10">
            {navLinks.map((item) => {
              const isCurrentPage = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isCurrentPage
                      ? 'text-slate-900 dark:text-white font-semibold bg-white/90 dark:bg-slate-700/90 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/30 dark:hover:bg-slate-700/30'
                  }`}
                >
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            
            {/* Mobile User Actions */}
            <div className="border-t border-white/20 dark:border-white/10 pt-4 mt-4 relative z-10">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user?.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-center w-full px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg transition-colors font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 rounded-lg text-white font-medium shadow-lg shadow-primary-500/40"
                  >
                    Sign up
                  </Link>
                </div>
              )}
              
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-4 py-2 mt-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">Dark mode</span>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-800 p-1 text-xs shadow-inner shadow-black/10 dark:shadow-black/40 transition-colors duration-300"
                  aria-label="Toggle dark mode"
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-md shadow-primary-500/40 ${
                      isDark ? 'translate-x-0' : 'translate-x-5'
                    }`}
                  >
                    <span className="text-[10px]">{isDark ? '☾' : '☀'}</span>
                  </motion.div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Navbar;


