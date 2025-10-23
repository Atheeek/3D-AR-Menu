'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import PolishedModal from '@/components/admin/PolishedModal';
import Image from 'next/image';
import { FiEdit, FiTrash2, FiRefreshCw, FiPlus, FiExternalLink } from 'react-icons/fi';

// --- Interfaces ---
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
  modelUrl?: string;
  usdzModelUrl?: string;
  generationTaskId?: string;
}

type FormState = Omit<MenuItem, '_id' | 'price' | 'imageUrl' | 'modelUrl' | 'usdzModelUrl' | 'generationTaskId'> & {
  price: string;
};

interface RestaurantInfo {
  _id: string;
  name: string;
}

// --- Component ---
export default function DashboardPage() {
  const router = useRouter();
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [menuDirectUrl, setMenuDirectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingStatusId, setCheckingStatusId] = useState<string | null>(null);

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormState>({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  // --- 1. Data Fetching ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

        const [menuRes, qrRes] = await Promise.all([
          fetch(`${apiBaseUrl}/menu/my-items`, { headers }),
          fetch(`${apiBaseUrl}/restaurants/my-qr-code`, { headers })
        ]);

        if (menuRes.status === 401 || qrRes.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/admin/login');
          return;
        }

        if (!menuRes.ok) throw new Error(`Failed to fetch menu items (Status: ${menuRes.status})`);
        if (!qrRes.ok) throw new Error(`Failed to fetch QR code (Status: ${qrRes.status})`);

        const menuData = await menuRes.json();
        const qrData = await qrRes.json();

        setMenuItems(menuData);
        setRestaurantInfo({ _id: "temp-id", name: "Your Restaurant" });
        setQrCodeUrl(qrData.qrCodeDataUrl);
        setMenuDirectUrl(qrData.menuUrl);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // --- 2. Event Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItemId(null);
    setSelectedFile(null);
    setError(null);
    setFormData({ name: '', description: '', price: '', category: '' });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', description: '', price: '', category: '' });
    setCurrentItemId(null);
    setSelectedFile(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setModalMode('edit');
    setCurrentItemId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
    });
    setSelectedFile(null);
    setError(null);
    setIsModalOpen(true);
  };

  // --- 3. API Call: Create or Update Item ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }

    let savedItem: MenuItem;
    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      setError("Price must be a valid positive number.");
      return;
    }
    const bodyPayload = { ...formData, price: priceNumber };

    try {
      if (modalMode === 'edit' && currentItemId) {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/menu/items/${currentItemId}`;
        const res = await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });
        if (!res.ok) { const errData = await res.json(); throw new Error(errData.message || 'Failed to update item text data.'); }
        savedItem = await res.json();
        setMenuItems(prev => prev.map(item => item._id === currentItemId ? savedItem : item));
      } else {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/menu/items`;
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });
        if (!res.ok) { const errData = await res.json(); throw new Error(errData.message || 'Failed to create item.'); }
        savedItem = await res.json();
        setMenuItems(prev => [...prev, savedItem]);
      }

      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append('image', selectedFile);
        const uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/menu/items/${savedItem._id}/upload-model`;
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fileFormData,
        });

        if (!uploadRes.ok) {
          const uploadErrorData = await uploadRes.json();
          throw new Error(uploadErrorData.message || 'Item text saved, but image upload failed.');
        } else {
           const uploadResult = await uploadRes.json();
           const updatedItemWithTask = uploadResult.menuItem;
           setMenuItems(prev => prev.map(item => item._id === updatedItemWithTask._id ? updatedItemWithTask : item));
           closeModal();
           setSelectedFile(null);
        }
      } else {
        closeModal();
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- 4. API Call: Delete Item ---
  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) { return; }
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }
    setError(null);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/menu/items/${itemId}`;
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) { throw new Error('Failed to delete the item.'); }
      setMenuItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- 5. API Call: Check Model Status ---
  const handleCheckStatus = async (itemId: string) => {
     setError(null);
     setCheckingStatusId(itemId);
     const token = localStorage.getItem('authToken');
     if (!token) { router.push('/admin/login'); return; }

     try {
         const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/menu/items/${itemId}/check-model-status`;
         const res = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
         const data = await res.json();

         if (!res.ok) {
             throw new Error(data.message || 'Failed to check status.');
         }

         if (data.status === 'succeeded') {
             setMenuItems(prev => prev.map(item => item._id === itemId ? data.menuItem : item));
             alert(`Model for "${data.menuItem.name}" is ready!`);
         } else if (data.status === 'processing') {
             alert('Model generation is still in progress. Please check again in a few minutes.');
         } else {
             setMenuItems(prev => prev.map(item => {
                if (item._id === itemId) {
                    const { generationTaskId, ...rest } = item;
                    return rest;
                }
                return item;
             }));
             setError(`Model generation failed: ${data.message || 'Unknown error'}`);
         }

     } catch (err: any) {
         setError(err.message);
     } finally {
        setCheckingStatusId(null);
     }
  };

  // --- 6. Helper Function for Model Status Display ---
  const getModelStatusDisplay = (item: MenuItem): { text: string; color: string; bgColor: string; showCheckButton: boolean } => {
    if (item.modelUrl) {
      return { text: 'Ready', color: 'text-emerald-700', bgColor: 'bg-emerald-50', showCheckButton: false };
    }
    if (item.generationTaskId) {
      return { text: 'Processing', color: 'text-amber-700', bgColor: 'bg-amber-50', showCheckButton: true };
    }
    return { text: 'No Model', color: 'text-slate-600', bgColor: 'bg-slate-100', showCheckButton: false };
  };

  // --- 7. Simple Analytics Calculations ---
  const totalItems = menuItems.length;
  const arReadyItems = menuItems.filter(item => item.modelUrl).length;

  // --- 8. Render Logic ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full pt-20">
        <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-brand-text-secondary">Loading your restaurant data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-8">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-text">Dashboard</h1>
            <p className="text-brand-text-secondary mt-1">Manage your AR menu items</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-dark rounded-lg hover:bg-brand-gold-light transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FiPlus className="w-5 h-5" />
            Add Menu Item
          </button>
        </div>

        {/* Display general page errors */}
        {error && !isModalOpen && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Items Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Items</p>
                <p className="mt-2 text-4xl font-bold text-blue-900">{totalItems}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* AR-Ready Items Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">AR-Ready</p>
                <p className="mt-2 text-4xl font-bold text-emerald-900">{arReadyItems}</p>
              </div>
              <div className="p-3 bg-emerald-500 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* QR Code Card */}
          {qrCodeUrl && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm border border-amber-200">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-600 uppercase tracking-wide mb-2">Menu QR Code</p>
                  <a 
                    href={menuDirectUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-medium group"
                  >
                    View Menu
                    <FiExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
                <div className="ml-4">
                  <Image 
                    src={qrCodeUrl} 
                    alt="Menu QR Code" 
                    width={80} 
                    height={80} 
                    className="border-2 border-amber-300 p-1 bg-white rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your restaurant's AR menu offerings</p>
          </div>
          
          {menuItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Item Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">3D Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuItems.map((item) => {
                    const status = getModelStatusDisplay(item);
                    const isChecking = checkingStatusId === item._id;
                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-600">{item.name.charAt(0)}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">{item.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="px-3 py-1 inline-flex text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${status.bgColor} ${status.color}`}>
                              {status.text === 'Ready' && (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {status.text}
                            </span>
                            {status.showCheckButton && (
                              <button
                                onClick={() => handleCheckStatus(item._id)}
                                disabled={isChecking}
                                className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait transition-all"
                                title="Check Model Status"
                              >
                                <FiRefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(item)} 
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit Item"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id)} 
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Item"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No menu items yet</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">Get started by adding your first menu item. Each item can have a 3D model generated automatically.</p>
              <button
                onClick={openCreateModal}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-dark rounded-lg hover:bg-brand-gold-light transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <FiPlus className="w-5 h-5" />
                Add Your First Item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Enhanced Modal for Create/Edit --- */}
      <PolishedModal  isOpen={isModalOpen} onClose={closeModal}  title={modalMode === 'create' ? 'Create New Menu Item' : 'Edit Menu Item'}>
         <form onSubmit={handleSubmit} className="space-y-5 bg-white">
             {error && isModalOpen && (
                 <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                      </div>
                    </div>
                 </div>
             )}
             
             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="modal-name">
                   Item Name <span className="text-red-500">*</span>
                 </label>
                 <input 
                   id="modal-name" 
                   type="text" 
                   name="name" 
                   value={formData.name} 
                   onChange={handleInputChange} 
                   className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-gray-900 placeholder-gray-400 transition-all" 
                   placeholder="e.g., Margherita Pizza"
                   required 
                 />
             </div>

             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="modal-description">
                   Description <span className="text-red-500">*</span>
                 </label>
                 <textarea 
                   id="modal-description" 
                   name="description" 
                   value={formData.description} 
                   onChange={handleInputChange} 
                   rows={3} 
                   className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-gray-900 placeholder-gray-400 transition-all resize-none" 
                   placeholder="Describe your dish..."
                   required 
                 />
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="modal-price">
                       Price <span className="text-red-500">*</span>
                     </label>
                     <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                       <input 
                         id="modal-price" 
                         type="number" 
                         name="price" 
                         value={formData.price} 
                         onChange={handleInputChange} 
                         className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-gray-900 placeholder-gray-400 transition-all" 
                         placeholder="0.00"
                         step="0.01" 
                         min="0" 
                         required 
                       />
                     </div>
                 </div>
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="modal-category">
                       Category <span className="text-red-500">*</span>
                     </label>
                     <input 
                       id="modal-category" 
                       type="text" 
                       name="category" 
                       value={formData.category} 
                       onChange={handleInputChange} 
                       className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-gray-900 placeholder-gray-400 transition-all" 
                       placeholder="e.g., Main Course"
                       required 
                     />
                 </div>
             </div>

             <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="modal-image">
                   3D Model Image
                 </label>
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                   <div className="flex items-start gap-3">
                     <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                     </svg>
                     <div>
                       <p className="text-sm font-medium text-blue-900">Automatic 3D Generation</p>
                       <p className="text-xs text-blue-700 mt-1">Upload a clear photo and we'll automatically generate a 3D model for AR viewing.</p>
                     </div>
                   </div>
                 </div>
                 <div className="relative">
                   <input 
                     id="modal-image" 
                     type="file" 
                     name="image" 
                     accept="image/png, image/jpeg" 
                     onChange={handleFileChange} 
                     className="w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-brand-dark hover:file:bg-brand-gold-light cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-all bg-white border border-gray-300 rounded-lg" 
                   />
                 </div>
                 {selectedFile && (
                   <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                     <div className="flex items-center gap-2">
                       <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                       <span className="text-sm font-medium text-green-800">{selectedFile.name}</span>
                     </div>
                   </div>
                 )}
             </div>

             <div className="flex justify-end pt-6 border-t border-gray-200 gap-3">
                 <button 
                   type="button" 
                   onClick={closeModal} 
                   className="px-6 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="px-6 py-2.5 rounded-lg bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-all font-semibold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                 >
                   {modalMode === 'create' ? 'Create Item' : 'Save Changes'}
                 </button>
             </div>
         </form>
      </PolishedModal>
    </>
  );
}