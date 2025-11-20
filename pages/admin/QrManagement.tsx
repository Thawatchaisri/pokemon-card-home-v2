
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { apiService } from '../../services/api';
import { Upload, Save, RefreshCw, Loader2, Image as ImageIcon, X } from 'lucide-react';

const QrManagement: React.FC = () => {
  const [currentQr, setCurrentQr] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchQr();
  }, []);

  const fetchQr = async () => {
    try {
      const url = await apiService.getLineQr();
      setCurrentQr(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setMessage(null);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setMessage(null);

    try {
      await apiService.updateLineQr(selectedFile);
      setMessage({ type: 'success', text: 'QR Code updated successfully!' });
      
      // Refresh current QR and clear selection
      fetchQr();
      handleCancel();
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update QR Code.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">LINE QR Management</h1>
        <p className="text-gray-500">Update the QR code displayed to customers for LINE purchases.</p>
      </div>

      <div className="max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        {/* Feedback Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Current QR Section */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current QR Code</h3>
            <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 w-full max-w-xs flex items-center justify-center aspect-square">
              {loading ? (
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
              ) : (
                <img 
                  src={currentQr} 
                  alt="Current QR" 
                  className="w-full h-full object-contain rounded-lg shadow-sm" 
                />
              )}
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              This image is currently visible to all users clicking "Buy".
            </p>
          </div>

          {/* Update Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New QR</h3>
            
            {!selectedFile ? (
              <div className="flex-1 flex flex-col">
                <label className="flex-1 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                   <img src={previewUrl || ''} alt="Preview" className="w-full h-full object-contain" />
                   <button 
                     onClick={handleCancel}
                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                     title="Remove"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {selectedFile.name}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
               <button 
                 onClick={handleSave}
                 disabled={!selectedFile || uploading}
                 className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-sm"
               >
                 {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                 Save Changes
               </button>
               
               {selectedFile && (
                 <button 
                   onClick={handleCancel}
                   disabled={uploading}
                   className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                 >
                   Cancel
                 </button>
               )}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default QrManagement;
