
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Link } from 'react-router-dom';
import { CreditCard, TrendingUp, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Cards</p>
            <p className="text-2xl font-bold text-gray-900">1,245</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">$45,230</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
           <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Visits Today</p>
            <p className="text-2xl font-bold text-gray-900">342</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/admin/cards/new" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
            Add New Card
          </Link>
          <Link to="/admin/cards" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Manage Inventory
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
