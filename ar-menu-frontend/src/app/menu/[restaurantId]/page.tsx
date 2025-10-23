'use client';
import { useEffect, useState, useMemo, ChangeEvent, use } from 'react';
import ARViewer from '@/components/ARViewer';
import PolishedModal from '@/components/admin/PolishedModal';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUp, FiSearch, FiX } from 'react-icons/fi';

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
  logoUrl?: string; // Add logoUrl
  menuItems: MenuItem[];
}

interface GroupedMenu {
  [category: string]: MenuItem[];
}

interface MenuPageProps {
  params: Promise<{ restaurantId: string; }>; // Expect a Promise
}

// --- Component ---
export default function MenuPage({ params }: MenuPageProps) {
  const resolvedParams = use(params);
  const { restaurantId } = resolvedParams;  const [restaurantName, setRestaurantName] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [arItem, setArItem] = useState<MenuItem | null>(null);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null); // Add state for logo

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
        setRestaurantLogo(data.logoUrl || null); // <-- Store the logo URL

      } catch (err: any) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchMenu();

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);

  }, [restaurantId]);

  // --- Memoized Grouping and Filtering ---
  const { groupedMenu, categories, filteredCount } = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const searchedItems = searchTerm
      ? menuItems.filter(item =>
          item.name.toLowerCase().includes(lowerSearchTerm) ||
          item.description.toLowerCase().includes(lowerSearchTerm)
        )
      : menuItems;

    const categoryFilteredItems = selectedCategory === 'All'
      ? searchedItems
      : searchedItems.filter(item => (item.category || 'Other') === selectedCategory);

    const grouped = categoryFilteredItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as GroupedMenu);

    const allCategories = ['All', ...Array.from(new Set(menuItems.map(item => item.category || 'Other'))).sort()];

    return {
        groupedMenu: grouped,
        categories: allCategories,
        filteredCount: categoryFilteredItems.length
    };
  }, [menuItems, selectedCategory, searchTerm]);

  // --- Scroll To Top Function ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-base font-medium text-slate-700">Preparing your menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="text-center bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl border border-red-100">
             <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <h2 className="text-lg font-bold text-slate-900 mb-2">Menu Unavailable</h2>
             <p className="text-sm text-slate-600 mb-4">{error}</p>
             <Link href="/" className="inline-block px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm">
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
        {/* Elegant Header - Mobile Optimized */}
        <header className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white py-6 px-4 relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-block mb-3">
              <div className="w-16 h-0.5 bg-amber-500 mx-auto rounded-full"></div>
            </div>
            <div className='flex items-center justify-center '>
            {restaurantLogo && (
               <Image
                 src={restaurantLogo}
                 alt={`${restaurantName} Logo`}
                 width={96} // Example size, adjust as needed (w-24)
                 height={96} // Example size, adjust as needed (h-24)
                 className="  shadow-lg  object-cover"
                 unoptimized // May be needed depending on R2/Next.js config
               />
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-2 tracking-tight">
              {restaurantName}
            </h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base font-light max-w-lg mx-auto">
              Explore our menu with interactive 3D previews
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Search Bar - Mobile Optimized */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-900 placeholder-slate-400 shadow-sm text-sm sm:text-base"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              {searchTerm && (
                 <button 
                   onClick={() => setSearchTerm('')} 
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 focus:outline-none"
                 >
                    <FiX className="h-5 w-5"/>
                 </button>
              )}
            </div>
          </div>

          {/* Category Navigation - Mobile Optimized with Horizontal Scroll */}
          <nav className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-min">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 focus:outline-none ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>

          {/* Menu Items - Mobile Optimized */}
          {filteredCount === 0 && !loading ? (
             <div className="text-center py-12">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <p className="text-slate-600 text-base">No items found</p>
             </div>
          ) : (
            <div className="space-y-10">
              {categoryOrder.map((category, index) => (
                <section key={category}>
                  {/* Category Title */}
                  {(selectedCategory === 'All' || searchTerm) && (
                    <div className="mb-5">
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 inline-block relative">
                        {category}
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                      </h2>
                    </div>
                  )}
                  
                  {/* Menu Items - Stacked Cards for Mobile */}
                  <div className="space-y-4">
                    {groupedMenu[category].map((item) => (
                      <div 
                        key={item._id} 
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-slate-100"
                      >
                        {/* Image Section - Full Width on Mobile */}
                        <div className="relative w-full h-48 sm:h-56 bg-slate-100">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                              className="hover:scale-105 transition-transform duration-500"
                              unoptimized={process.env.NODE_ENV === 'development'}
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
                              {/* <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm bg-opacity-95">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                AR
                              </span> */}
                            </div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1.5">
                              {item.name}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Price and AR Button */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-baseline">
                              <span className="text-xl font-bold text-slate-900">
                                ₹ {item.price.toFixed(2)}
                              </span>
                            </div>

                            {item.modelUrl && (
                              <button
                                onClick={() => setArItem(item)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                <span className="hidden xs:inline">View in AR</span>
                                <span className="xs:hidden">AR</span>
                              </button>
                            )}
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

        {/* Footer - Mobile Optimized */}
        <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs sm:text-sm">Powered by AR Menu Technology</p>
          </div>
        </footer>

        {/* Back to Top Button - Mobile Optimized */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-amber-600 text-white p-3 rounded-full shadow-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 z-30 active:scale-95"
            aria-label="Scroll back to top"
          >
            <FiArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* --- AR Modal - Mobile Optimized --- */}
      {arItem && (
        <PolishedModal isOpen={!!arItem} onClose={() => setArItem(null)} title={arItem.name}>
            <div className="w-full aspect-square relative mb-4 bg-slate-100 rounded-lg overflow-hidden">
                 <ARViewer
                     itemName={arItem.name}
                     modelUrl={arItem.modelUrl!}
                     iosModelUrl={arItem.usdzModelUrl || ''}
                 />
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1.5">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{arItem.description}</p>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-2xl font-bold text-slate-900">${arItem.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setArItem(null)} 
                  className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all font-medium text-sm"
                >
                  Close
                </button>
            </div>
        </PolishedModal>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}