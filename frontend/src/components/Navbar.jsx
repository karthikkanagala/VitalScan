import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLanding = location.pathname === '/';

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e, id) => {
    if (isLanding) {
      e.preventDefault();
      scrollToSection(id);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLanding
          ? 'bg-transparent'
          : 'bg-black/80 backdrop-blur-md border-b border-green-400/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-glow">
            <span className="gradient-text">◆</span> VITAL<span className="gradient-text">SCAN</span>
          </div>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {isLanding ? (
            <>
              <button
                onClick={(e) => handleNavClick(e, 'features')}
                className="nav-link"
              >
                Features
              </button>
              <button
                onClick={(e) => handleNavClick(e, 'about')}
                className="nav-link"
              >
                About
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              {location.pathname === '/dashboard' && (
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                  className="nav-link text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              )}
            </>
          )}

          {isLanding && (
            <Link to="/signin" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-400 hover:text-green-300 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-b border-green-400/20 animate-slide-down">
          <div className="px-6 py-4 space-y-4">
            {isLanding ? (
              <>
                <button
                  onClick={(e) => {
                    handleNavClick(e, 'features');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left nav-link py-2"
                >
                  Features
                </button>
                <button
                  onClick={(e) => {
                    handleNavClick(e, 'about');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left nav-link py-2"
                >
                  About
                </button>
              </>
            ) : (
              <Link to="/" className="block nav-link py-2">
                Home
              </Link>
            )}
            {isLanding && (
              <Link to="/signin" className="block btn-primary text-center">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
