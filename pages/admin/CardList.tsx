
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card } from '../../types';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

const AdminCardList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    const res = await apiService.getCards(1, 100, 'All'); // Get all for admin list (simplified)
    setCards(res.data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await apiService.deleteCard(id);
      setCards(cards.filter(c => c.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Cards</h1>
        <Link 
          to="/admin/cards/new" 
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Card
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Lang</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={card.images?.[0]?.url || card.imageUrl} 
                        alt="" 
                        className="h-12 w-9 object-cover rounded bg-gray-100 border"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{card.name}</td>
                    <td className="px-6 py-4 text-gray-500">{card.category}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">${card.manualPrice}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                        {card.language}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      <Link to={`/admin/cards/${card.id}`} className="text-blue-600 hover:text-blue-900 inline-block">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(card.id)} className="text-red-600 hover:text-red-900 inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCardList;
