'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string): string => {
    const baseClass = 'px-4 py-2 rounded-md transition-colors duration-200';
    return isActive(path)
      ? `${baseClass} bg-primary-100 text-primary-700 font-medium`
      : `${baseClass} text-gray-600 hover:bg-gray-100 hover:text-gray-900`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900">InvoiceMe</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className={navLinkClass('/')}>
              Dashboard
            </Link>
            <Link href="/customers" className={navLinkClass('/customers')}>
              Customers
            </Link>
            <Link href="/invoices" className={navLinkClass('/invoices')}>
              Invoices
            </Link>
            <Link href="/payments" className={navLinkClass('/payments')}>
              Payments
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.username || 'Admin'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

