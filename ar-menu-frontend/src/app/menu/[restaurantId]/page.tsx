'use client';

import { useEffect, useState, useMemo } from 'react';
import ARViewer from '@/components/ARViewer';
import PolishedModal from '@/components/admin/PolishedModal';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUp } from 'react-icons/fi';

// --- Interfaces ---
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  modelUrl?: string;
  usdzModelUrl?: string;
}

interface RestaurantData {
  _id: string;
  name: string;
  menuItems: MenuItem[];
}

interface GroupedMenu {
  [category: string]: MenuItem[];
}

interface MenuPageProps {
  params: { restaurantId: string; };
}

// --- Component ---
export default function MenuPage({ params }: MenuPageProps) {
  const { restaurantId } = params;
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [arItem, setArItem] = useState<MenuItem | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    if (!restaurantId) {
      setError("Restaurant ID is missing from the URL.");
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      setLoading(true); setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/menu/${restaurantId}`;
        const res = await fetch(apiUrl);
        if (!res.ok) {
          if (res.status === 404) throw new Error(`Restaurant not found.`);
          throw new Error(`Could not fetch menu data (Status: ${res.status}).`);
        }
        const data: RestaurantData = await res.json();

        setRestaurantName(data.name || 'Restaurant Menu');
        setMenuItems(data.menuItems || []);

      } catch (err: any) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchMenu();

    // --- Back to Top Button Scroll Listener ---
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);

  }, [restaurantId]);

  // --- Memoized Grouping and Filtering for Performance ---
  const { groupedMenu, categories } = useMemo(() => {
    const filteredItems = selectedCategory === 'All'
      ? menuItems
      : menuItems.filter(item => (item.category || 'Other') === selectedCategory);

    const grouped = filteredItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as GroupedMenu);

    const allCategories = ['All', ...Array.from(new Set(menuItems.map(item => item.category || 'Other'))).sort()];

    return { groupedMenu: grouped, categories: allCategories };
  }, [menuItems, selectedCategory]);

  // --- Scroll To Top Function ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-slate-700">Preparing your menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center bg-white p-8 rounded-2xl max-w-md mx-4 shadow-xl border border-red-100">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <h2 className="text-xl font-bold text-slate-900 mb-2">Menu Unavailable</h2>
             <p className="text-sm text-slate-600">{error}</p>
             <Link href="/" className="mt-6 inline-block px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm">
               Return Home
             </Link>
          </div>
      </div>
    );
  }

  const categoryOrder = Object.keys(groupedMenu).sort();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Elegant Header with Restaurant Name */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block mb-4">
              <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight">
              {restaurantName}
            </h1>
            <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl mx-auto">
              Discover our culinary creations with interactive 3D previews
            </p>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          {/* Category Navigation */}
          <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md py-6 -mx-4 px-4 mb-12 shadow-sm border-y border-slate-200">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>

          {/* Menu Items */}
          {categoryOrder.length === 0 && !loading ? (
             <div className="text-center py-16">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <p className="text-slate-600 text-lg">No items found matching your selection</p>
             </div>
          ) : (
            <div className="space-y-16">
              {categoryOrder.map((category, index) => (
                <section key={category} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  {/* Category Title - Only show when viewing all */}
                  {selectedCategory === 'All' && (
                    <div className="mb-10">
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 inline-block relative">
                        {category}
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                      </h2>
                    </div>
                  )}
                  
                  {/* Menu Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupedMenu[category].map((item) => (
                      <div 
                        key={item._id} 
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-amber-200"
                      >
                        <div className="flex flex-col sm:flex-row h-full">
                          {/* Image Section */}
                          <div className="relative sm:w-40 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-100">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            {/* AR Badge */}
                            {item.modelUrl && (
                              <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                  </svg>
                                  AR
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="flex flex-col justify-between p-5 flex-grow">
                            <div className="mb-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors pr-2">
                                  {item.name}
                                </h3>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>

                              {/* AR Button */}
                              {item.modelUrl && (
                                <button
                                  onClick={() => setArItem(item)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                  </svg>
                                  View in AR
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">Powered by AR Menu Technology</p>
          </div>
        </footer>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-amber-600 text-white p-4 rounded-full shadow-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 z-30 transform hover:scale-110"
            aria-label="Scroll back to top"
          >
            <FiArrowUp className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* --- AR Modal --- */}
      {arItem && (
        <PolishedModal isOpen={!!arItem} onClose={() => setArItem(null)} title={arItem.name}>
            <div className="w-full aspect-square relative mb-6 bg-slate-100 rounded-lg overflow-hidden">
                 <ARViewer
                     itemName={arItem.name}
                     modelUrl={arItem.modelUrl!}
                     iosModelUrl={arItem.usdzModelUrl || ''}
                 />
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{arItem.description}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-2xl font-bold text-slate-900">${arItem.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setArItem(null)} 
                  className="px-6 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  Close
                </button>
            </div>
        </PolishedModal>
      )}
    </>
  );
}