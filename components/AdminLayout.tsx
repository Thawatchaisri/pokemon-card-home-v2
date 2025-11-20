
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, QrCode, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : ''}`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 py-6">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/cards" icon={CreditCard} label="Manage Cards" />
          <NavItem to="/admin/qr" icon={QrCode} label="LINE QR" />
          <div className="border-t my-2 mx-4"></div>
          <NavItem to="/" icon={Home} label="Back to Site" />
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white shadow-sm z-40 p-4 flex justify-between items-center">
          <span className="font-bold text-primary">Admin Panel</span>
          <button onClick={handleLogout}><LogOut className="w-5 h-5" /></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
