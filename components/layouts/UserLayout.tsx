'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileBarChart, 
  Package, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  Mail,
  Building2,
  ShieldCheck,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Redirect if not authenticated or not a user
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'USER') {
      router.push('/admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  if (!user || user.role !== 'USER') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Buyers', href: '/dashboard/buyers', icon: Users },
    { name: 'HS Codes', href: '/dashboard/hs-codes', icon: Package },
    { name: 'Scenarios', href: '/dashboard/scenarios', icon: Layers },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-white p-2 shadow-lg border-2 border-slate-200 hover:bg-slate-50 transition-all duration-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-slate-700" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-white shadow-2xl border-r-2 border-slate-200">
          {/* Logo/Brand */}
          <div className="flex h-20 items-center justify-center border-b-2 border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FBR Invoice</h1>
                <p className="text-xs text-blue-100">User Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-100 hover:to-blue-50 hover:text-blue-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t-2 border-slate-200 p-4 space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 p-4 border-2 border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-blue-600 font-medium">User</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center text-slate-600 truncate">
                  <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-slate-600 truncate">
                  <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{user.businessName}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 lg:h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm">
          {/* Mobile: Add padding for menu button */}
          <div className="lg:hidden w-12"></div>
          
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {pathname === '/dashboard' ? 'Dashboard' : 
               pathname === '/dashboard/buyers' ? 'Buyers Management' :
               pathname === '/dashboard/hs-codes' ? 'HS Codes Management' :
               pathname === '/dashboard/invoices' ? 'Invoices Management' : 'User Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
              {pathname === '/dashboard' ? 'Welcome back! Here\'s your overview' :
               pathname === '/dashboard/buyers' ? 'Manage your buyer information' :
               pathname === '/dashboard/hs-codes' ? 'Manage your HS codes' :
               pathname === '/dashboard/invoices' ? 'Create and manage invoices' : 'Manage your account'}
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-right px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs lg:text-sm font-semibold text-slate-900 truncate max-w-[120px] lg:max-w-none">{user.name}</p>
              <p className="text-xs text-blue-600 font-medium">User</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
