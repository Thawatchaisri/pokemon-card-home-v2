
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, Language, CardCategory, CardImage } from '../../types';
import { apiService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

const AdminCardForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Card>>({
    name: '',
    category: CardCategory.POKEMON,
    language: Language.EN,
    setName: '',
    year: new Date().getFullYear(),
    condition: 'Near Mint',
    manualPrice: 0,
    images: []
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      apiService.getCardById(id).then(card => {
        if (card) {
            // Ensure images array exists
            const images = card.images || (card.imageUrl ? [{ id: 'legacy', url: card.imageUrl, sortOrder: 0 }] : []);
            setFormData({ ...card, images });
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoading(true);
      const newImages: CardImage[] = [...(formData.images || [])];
      
      // Upload each file
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        try {
            const url = await apiService.uploadImage(file);
            newImages.push({
                id: `new-${Date.now()}-${i}`,
                url,
                sortOrder: newImages.length
            });
        } catch (err) {
            console.error("Upload failed", err);
        }
      }
      
      setFormData(prev => ({ ...prev, images: newImages }));
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = formData.images?.filter((_, idx) => idx !== indexToRemove) || [];
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const images = [...(formData.images || [])];
    if (direction === 'up' && index > 0) {
        [images[index], images[index - 1]] = [images[index - 1], images[index]];
    } else if (direction === 'down' && index < images.length - 1) {
        [images[index], images[index + 1]] = [images[index + 1], images[index]];
    }
    
    // Reassign sort orders
    const reordered = images.map((img, idx) => ({ ...img, sortOrder: idx }));
    setFormData(prev => ({ ...prev, images: reordered }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure fallback imageUrl is set for backward compatibility
    const payload = {
        ...formData,
        imageUrl: formData.images?.[0]?.url || '' 
    };

    try {
      if (isEdit && id) {
        await apiService.updateCard(id, payload);
      } else {
        await apiService.createCard(payload as any);
      }
      navigate('/admin/cards');
    } catch (error) {
      console.error(error);
      alert('Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/admin/cards')} className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Card' : 'Add New Card'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none">
              {Object.values(CardCategory).filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select name="language" value={formData.language} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none">
              {Object.values(Language).map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Set Name</label>
            <input required name="setName" value={formData.setName} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <input required name="condition" value={formData.condition} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manual Price ($)</label>
            <input type="number" step="0.01" required name="manualPrice" value={formData.manualPrice} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
          </div>

          {/* Image Upload Section */}
          <div className="col-span-2 mt-4 border-t pt-6">
            <label className="block text-lg font-medium text-gray-900 mb-4">Card Images (Max 10)</label>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               {formData.images?.map((img, idx) => (
                 <div key={img.id} className="relative group aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
                   <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => moveImage(idx, 'up')} disabled={idx === 0} className="p-1 bg-white rounded text-gray-800 disabled:opacity-50 hover:bg-blue-100"><ChevronUp size={16} /></button>
                        <button type="button" onClick={() => moveImage(idx, 'down')} disabled={idx === (formData.images?.length || 0) - 1} className="p-1 bg-white rounded text-gray-800 disabled:opacity-50 hover:bg-blue-100"><ChevronDown size={16} /></button>
                      </div>
                      <button type="button" onClick={() => removeImage(idx)} className="p-1 bg-red-500 rounded text-white hover:bg-red-600"><X size={16} /></button>
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1">
                     {idx === 0 ? 'Cover Image' : `Image ${idx + 1}`}
                   </div>
                 </div>
               ))}
               
               {(formData.images?.length || 0) < 10 && (
                 <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 aspect-[3/4]">
                   <Upload className="w-8 h-8 text-gray-400 mb-2" />
                   <span className="text-sm text-gray-500 font-medium">Upload</span>
                   <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                 </label>
               )}
            </div>
            <p className="text-xs text-gray-500">First image will be used as the thumbnail. Reorder using arrows.</p>
          </div>

        </div>

        <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center"
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
               Save Card
            </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCardForm;
