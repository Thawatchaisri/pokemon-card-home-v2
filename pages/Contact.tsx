import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('contactTitle')}</h1>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Contact Info */}
          <div className="bg-primary p-8 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 mt-1 opacity-80" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="opacity-80 text-sm">support@cardcollector.pro</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 mt-1 opacity-80" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="opacity-80 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 mt-1 opacity-80" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="opacity-80 text-sm">123 Pokemon Avenue,<br/>Tokyo, Japan</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <p className="text-sm opacity-60">© 2023 CardCollector Pro</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:w-3/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-3 border" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-3 border" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-3 border" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                <Send className="w-4 h-4 mr-2" />
                {t('submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;