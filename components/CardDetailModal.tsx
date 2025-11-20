
import React, { useState } from 'react';
import { Card } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ChartModal from './ChartModal';
import BuyModal from './BuyModal';
import { Calendar, Layers, CheckCircle, BarChart2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  const { t } = useLanguage();
  const [showChart, setShowChart] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle fallback if images array is empty but imageUrl exists
  const images = card.images && card.images.length > 0 
    ? card.images 
    : [{ id: 'default', url: card.imageUrl || 'https://via.placeholder.com/400x560?text=No+Image', sortOrder: 0 }];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (showChart) {
    return <ChartModal cardId={card.id} cardName={card.name} onClose={() => setShowChart(false)} />;
  }

  if (showBuy) {
    return <BuyModal onClose={() => setShowBuy(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up max-h-[90vh]">
        
        {/* Image Carousel Section */}
        <div className="w-full md:w-1/2 bg-gray-100 relative flex items-center justify-center p-6 group">
          <img 
            src={images[currentImageIndex].url} 
            alt={card.name} 
            className="max-h-80 md:max-h-[500px] w-auto object-contain rounded-lg shadow-lg"
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-2 w-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-4' : 'bg-gray-400'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="flex-1">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2 uppercase tracking-wide">
              {card.language} Edition
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{card.name}</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Layers className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium mr-2">{t('set')}:</span>
                <span>{card.setName}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium mr-2">{t('year')}:</span>
                <span>{card.year}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="w-5 h-5 mr-3 text-gray-400" />
                <span className="font-medium mr-2">{t('condition')}:</span>
                <span className="text-green-600 font-semibold">{card.condition}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100">
               <p className="text-sm text-gray-500 mb-1">{t('price')}</p>
               <div className="text-4xl font-bold text-primary">
                 ${card.manualPrice.toFixed(2)}
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <button 
              onClick={() => setShowChart(true)}
              className="flex items-center justify-center w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all duration-200"
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              {t('info')}
            </button>
            <button 
              onClick={() => setShowBuy(true)}
              className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transform active:scale-95 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('buy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
