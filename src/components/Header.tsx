import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Create an active link style helper
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-600 font-medium' : 'text-gray-700 hover:text-indigo-600';
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">Elnagar Art Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className={isActive('/')}>Home</Link>
              </li>
              <li>
                <Link to="/gallery" className={isActive('/gallery')}>Gallery</Link>
              </li>
              <li>
                <Link to="/about" className={isActive('/about')}>About</Link>
              </li>
              <li>
                <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/admin" className={isActive('/admin')}>
                      <span className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        Dashboard
                      </span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      Logout
                    </button>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <li>
                  <Link to="/login" className={`flex items-center ${isActive('/login')}`}>
                    <User className="mr-1 h-4 w-4" />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-50" ref={menuRef}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/')} hover:bg-gray-50`}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/gallery')} hover:bg-gray-50`}
            >
              Gallery
            </Link>
            <Link
              to="/about"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/about')} hover:bg-gray-50`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block rounded-md px-3 py-2 text-base font-medium ${isActive('/contact')} hover:bg-gray-50`}
            >
              Contact
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/admin')} hover:bg-gray-50`}
                >
                  <User className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${isActive('/login')} hover:bg-gray-50`}
              >
                <User className="mr-2 h-5 w-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;