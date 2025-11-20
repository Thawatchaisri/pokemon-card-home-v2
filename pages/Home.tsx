import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1613771404721-c5b42932645b?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Collect the <span className="text-primary">Extraordinary</span>
          </h1>
          <p className="mt-4 max-w-xl text-xl text-gray-300 mb-10">
            The premium marketplace for serious collectors. Real-time pricing, verified authenticity, and seamless purchasing for Pokemon, Baseball, and Football cards.
          </p>
          <div className="flex space-x-4">
            <Link to="/view-all" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 transition-colors">
              View All Cards <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/about" className="inline-flex items-center px-8 py-3 border border-gray-500 text-base font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Authenticity Guaranteed</h3>
              <p className="text-gray-600">Every card is verified by experts before listing.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Market Data</h3>
              <p className="text-gray-600">Make informed decisions with historical price charts.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rare Finds</h3>
              <p className="text-gray-600">Access to exclusive Thai and Japanese limited editions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;