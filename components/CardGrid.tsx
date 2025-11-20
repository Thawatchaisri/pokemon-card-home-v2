
import React, { useEffect, useState } from 'react';
import { Card, CardCategory, Language } from '../types';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import CardDetailModal from './CardDetailModal';
import { Loader2, AlertCircle } from 'lucide-react';

interface CardGridProps {
  category?: string;
  languageFilter?: Language;
  viewAllMode?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({ category, languageFilter, viewAllMode = false }) => {
  const { t } = useLanguage();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const LIMIT = 10; 

  useEffect(() => {
    setPage(1);
  }, [category, languageFilter]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const cat = viewAllMode ? CardCategory.ALL : category;
        const res = await apiService.getCards(page, LIMIT, cat, languageFilter);
        setCards(res.data);
        setTotal(res.total || 0);
      } catch (error) {
        console.error("Failed to fetch cards", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, category, languageFilter, viewAllMode]);

  const totalPages = Math.ceil(total / LIMIT);

  const getDisplayImage = (card: Card) => {
    if (card.images && card.images.length > 0) {
      // Find image with lowest sortOrder
      const sorted = [...card.images].sort((a, b) => a.sortOrder - b.sortOrder);
      return sorted[0].url;
    }
    return card.imageUrl || 'https://via.placeholder.com/400x560?text=No+Image';
  };

  return (
    <div className="pb-12">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-gray-500 font-medium">{t('loading')}</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p>No cards found.</p>
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {cards.map((card) => (
              <div 
                key={card.id} 
                onClick={() => setSelectedCard(card)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                  <img 
                    src={getDisplayImage(card)} 
                    alt={card.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider">
                    {card.language}
                  </div>
                  {card.images && card.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-full">
                      +{card.images.length - 1}
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{card.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{card.setName} • {card.year}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                      {card.condition}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${card.manualPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-600 font-medium flex items-center">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
};

export default CardGrid;
