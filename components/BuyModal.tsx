import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Loader2 } from 'lucide-react';

interface BuyModalProps {
  onClose: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const url = await apiService.getLineQr();
        setQrUrl(url);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQr();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative flex flex-col items-center text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">LINE Official</h3>
        <p className="text-gray-500 mb-6">{t('scanQr')}</p>

        <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300">
          {loading ? (
            <div className="h-48 w-48 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <img src={qrUrl} alt="LINE QR Code" className="h-48 w-48 object-cover rounded-lg" />
          )}
        </div>

        <div className="mt-6 w-full">
          <button
            onClick={onClose}
            className="w-full bg-secondary hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;