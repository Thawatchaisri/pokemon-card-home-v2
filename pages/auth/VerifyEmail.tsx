
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { ShieldCheck, Loader2, RefreshCw, X } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state or redirect to register if missing
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
        setError("Code must be 6 digits");
        return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await verifyEmail(email, code);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
        await apiService.resendCode(email);
        setResendStatus("Code sent! Check your console.");
        setTimeout(() => setResendStatus(''), 3000);
    } catch (e) {
        setResendStatus("Failed to resend");
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
             <ShieldCheck className="w-8 h-8" />
           </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Verify your email</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to <br/>
          <span className="font-bold text-gray-900">{email}</span>
        </p>
        <div className="mt-2 text-center text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
            Tip: Check your browser console (F12) for the code.
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="block w-full text-center text-3xl tracking-[0.5em] font-bold border-gray-300 rounded-md p-3 border focus:ring-primary focus:border-primary"
                placeholder="000000"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
             <button onClick={handleResend} className="text-sm text-primary hover:underline flex items-center justify-center w-full">
                <RefreshCw className="w-3 h-3 mr-1" /> Resend Code
             </button>
             {resendStatus && <p className="text-xs text-green-600 mt-2">{resendStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
