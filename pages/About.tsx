import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import { NewsItem } from '../types';
import { Loader2, Newspaper } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useLanguage();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getNews().then(data => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* About Section */}
        <section className="mb-16 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('about')}</h1>
          <div className="prose lg:prose-xl text-gray-600">
            <p>
              Welcome to CardCollector Pro, the premier destination for serious collectors. 
              We specialize in authentic Pokemon, Baseball, and Football trading cards, 
              offering transparency in pricing and condition.
            </p>
            <p className="mt-4">
              Our mission is to provide a safe, data-driven platform where collectors can 
              track market values and purchase rare items with confidence.
            </p>
          </div>
        </section>

        {/* News Section */}
        <section>
          <div className="flex items-center mb-8">
            <Newspaper className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">{t('newsTitle')}</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {news.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <div className="h-2 bg-primary w-full"></div>
                  <div className="p-6">
                    <span className="text-sm text-gray-400 font-medium">{new Date(item.date).toLocaleDateString()}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default About;