'use client'; // Needed for hooks like usePathname

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiList, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi'; // Example icons

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin/login'); // Redirect to login after logout
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Home', icon: FiHome },
    // Add more links as needed
    // { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    // { href: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <aside className="w-64 bg-brand-dark-secondary flex-shrink-0 border-r border- flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-">
        {/* Placeholder for Logo */}
        <span className="text-xl font-bold text-brand-gold">AR Menu</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-gray-100 text-brand-dark hover:bg-gray-200 font-semibold shadow-inner'
                  : 'text-brand-text-secondary hover:bg-gray-700 hover:text-brand-text'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {/* Logout Button */}
      <div className="px-4 py-4 border-t border-">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-brand-text-secondary hover:bg-red-800 hover:text-white transition-colors duration-200"
        >
          <FiLogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;