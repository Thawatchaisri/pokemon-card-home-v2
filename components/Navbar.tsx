
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { Menu, X, ChevronDown, Globe, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isPokemonMenuOpen, setIsPokemonMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">CardPro</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              <NavLink to="/">{t('home')}</NavLink>
              
              {/* Pokemon Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onMouseEnter={() => setIsPokemonMenuOpen(true)}
                  onClick={() => setIsPokemonMenuOpen(!isPokemonMenuOpen)}
                >
                  {t('pokemon')} <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isPokemonMenuOpen && (
                  <div 
                    className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    onMouseLeave={() => setIsPokemonMenuOpen(false)}
                  >
                    <div className="py-1" role="menu">
                      <Link to="/pokemon/en" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsPokemonMenuOpen(false)}>English Cards</Link>
                      <Link to="/pokemon/th" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsPokemonMenuOpen(false)}>Thai Cards</Link>
                      <Link to="/pokemon/jp" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsPokemonMenuOpen(false)}>Japanese Cards</Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/baseball">{t('baseball')}</NavLink>
              <NavLink to="/football">{t('football')}</NavLink>
              <NavLink to="/view-all">{t('viewAll')}</NavLink>
              <NavLink to="/about">{t('about')}</NavLink>
              <NavLink to="/contact">{t('contact')}</NavLink>
            </div>
          </div>

          <div className="flex items-center">
            {/* Language Switcher */}
            <div className="relative ml-3">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <Globe className="h-5 w-5" />
                <span className="ml-1 text-sm font-bold uppercase">{language}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {Object.values(Language).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${language === lang ? 'bg-gray-100 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {lang === Language.EN ? 'English' : lang === Language.TH ? 'ภาษาไทย' : '日本語'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center ml-4 space-x-2 pl-4 border-l">
                {isAuthenticated && user ? (
                   <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Hi, {user.username}</span>
                      {user.role === 'admin' && (
                          <Link to="/admin/dashboard" className="p-2 text-gray-500 hover:text-primary" title="Admin Dashboard">
                             <LayoutDashboard className="w-5 h-5" />
                          </Link>
                      )}
                      <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500" title="Logout">
                          <LogOut className="w-5 h-5" />
                      </button>
                   </div>
                ) : (
                   <>
                      <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary px-3 py-2">Log in</Link>
                      <Link to="/register" className="text-sm font-medium text-white bg-primary hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">Register</Link>
                   </>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-b">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/">{t('home')}</NavLink>
            <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-2 my-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">{t('pokemon')}</p>
              <NavLink to="/pokemon/en">English</NavLink>
              <NavLink to="/pokemon/th">Thai</NavLink>
              <NavLink to="/pokemon/jp">Japanese</NavLink>
            </div>
            <NavLink to="/baseball">{t('baseball')}</NavLink>
            <NavLink to="/football">{t('football')}</NavLink>
            <NavLink to="/view-all">{t('viewAll')}</NavLink>
            <NavLink to="/about">{t('about')}</NavLink>
            <NavLink to="/contact">{t('contact')}</NavLink>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated && user ? (
                <>
                   <div className="px-3 py-2 text-gray-500 font-medium flex items-center">
                      <User className="w-4 h-4 mr-2" /> {user.username}
                   </div>
                   {user.role === 'admin' && (
                      <NavLink to="/admin/dashboard">Dashboard</NavLink>
                   )}
                   <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                      Logout
                   </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                   <Link to="/login" className="block text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Log in</Link>
                   <Link to="/register" className="block text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-blue-700">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
