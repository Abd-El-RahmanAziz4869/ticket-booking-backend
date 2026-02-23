import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                TB
              </div>
              <span className="font-bold text-lg text-dark">TicketHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-dark hover:text-primary transition">
                Events
              </Link>
              {isAuthenticated && (
                <Link to="/my-bookings" className="text-dark hover:text-primary transition">
                  My Bookings
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-dark hover:text-primary transition">
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-dark">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 border-t">
              <Link to="/" className="block py-2 text-dark hover:text-primary">
                Events
              </Link>
              {isAuthenticated && (
                <Link to="/my-bookings" className="block py-2 text-dark hover:text-primary">
                  My Bookings
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-dark hover:text-primary">
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-dark hover:text-primary"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-dark hover:text-primary">
                    Login
                  </Link>
                  <Link to="/register" className="block py-2 text-dark hover:text-primary">
                    Register
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; 2024 TicketHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
