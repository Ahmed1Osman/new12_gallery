import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ShoppingCart, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' 
      : 'text-gray-700 hover:text-indigo-600';
  };

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.span 
              className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Elnagar Art Studio
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={item.path} 
                    className={`${isActive(item.path)} px-1 py-2 transition-all duration-200`}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-indigo-600 p-2"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-6 w-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-indigo-600 p-2"
                onClick={() => navigate('/wishlist')}
              >
                <Heart className="h-6 w-6" />
              </motion.button>

              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {user?.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:inline">{user?.username || 'User'}</span>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                      >
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-gray-700 hover:text-indigo-600 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden absolute w-full bg-white shadow-xl border-t border-gray-100"
            ref={menuRef}
          >
            <div className="px-2 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block rounded-md px-3 py-3 text-base font-medium ${isActive(item.path)} hover:bg-indigo-50 transition-colors`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-2 border-t border-gray-100">
                <Link
                  to="/cart"
                  className={`block rounded-md px-3 py-3 text-base font-medium ${isActive('/cart')} hover:bg-indigo-50`}
                >
                  <ShoppingCart className="inline-block mr-2 h-5 w-5" />
                  Cart
                </Link>
                <Link
                  to="/wishlist"
                  className={`block rounded-md px-3 py-3 text-base font-medium ${isActive('/wishlist')} hover:bg-indigo-50`}
                >
                  <Heart className="inline-block mr-2 h-5 w-5" />
                  Wishlist
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/admin"
                      className={`block rounded-md px-3 py-3 text-base font-medium ${isActive('/admin')} hover:bg-indigo-50`}
                    >
                      <User className="inline-block mr-2 h-5 w-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left rounded-md px-3 py-3 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <LogOut className="inline-block mr-2 h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`block rounded-md px-3 py-3 text-base font-medium ${isActive('/login')} hover:bg-indigo-50`}
                  >
                    <User className="inline-block mr-2 h-5 w-5" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;