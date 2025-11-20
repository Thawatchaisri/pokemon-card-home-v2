import React from 'react';
import CardGrid from '../components/CardGrid';
import { CardCategory, Language } from '../types';
import { useParams } from 'react-router-dom';

interface CollectionProps {
  category: CardCategory | 'All';
}

const Collection: React.FC<CollectionProps> = ({ category }) => {
  // Only used for Pokemon route with lang params
  const { lang } = useParams<{ lang: string }>();
  
  let languageFilter: Language | undefined = undefined;
  if (lang) {
    if (lang === 'en') languageFilter = Language.EN;
    if (lang === 'th') languageFilter = Language.TH;
    if (lang === 'jp') languageFilter = Language.JP;
  }

  const getTitle = () => {
    if (category === CardCategory.ALL) return "All Cards";
    if (category === CardCategory.POKEMON) {
       if (lang === 'en') return "Pokemon - English";
       if (lang === 'th') return "Pokemon - Thai";
       if (lang === 'jp') return "Pokemon - Japanese";
       return "Pokemon Cards";
    }
    return `${category} Collection`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{getTitle()}</h1>
          <p className="mt-2 text-gray-600">Browse our exclusive collection of rare trading cards.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CardGrid 
          category={category} 
          languageFilter={languageFilter} 
          viewAllMode={category === 'All'} 
        />
      </div>
    </div>
  );
};

export default Collection;