
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Collection from './pages/Collection';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCardList from './pages/admin/CardList';
import AdminCardForm from './pages/admin/CardForm';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CardCategory } from './types';

// Wrapper for Public pages to show Navbar
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-2xl font-bold">CardCollector Pro</span>
          <p className="text-gray-400 text-sm mt-2">© 2023 All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
            <span className="text-gray-400 text-sm cursor-pointer hover:text-white">Privacy Policy</span>
            <span className="text-gray-400 text-sm cursor-pointer hover:text-white">Terms of Service</span>
        </div>
      </div>
    </footer>
  </>
);

// Protected Route Wrapper
const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="cards" element={<AdminCardList />} />
                <Route path="cards/new" element={<AdminCardForm />} />
                <Route path="cards/:id" element={<AdminCardForm />} />
                <Route path="qr" element={<div className="p-8 text-center">QR Management Placeholder</div>} />
              </Route>

              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                
                <Route path="/pokemon" element={<Navigate to="/pokemon/en" replace />} />
                <Route path="/pokemon/:lang" element={<Collection category={CardCategory.POKEMON} />} />
                
                <Route path="/baseball" element={<Collection category={CardCategory.BASEBALL} />} />
                <Route path="/football" element={<Collection category={CardCategory.FOOTBALL} />} />
                
                <Route path="/view-all" element={<Collection category={CardCategory.ALL} />} />
                
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
