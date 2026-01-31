'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ReactNode, useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Globe, 
  ChevronRight,
  User,
  Mail,
  Shield,
  Menu,
  X,
  Layers,
  UserCog,
  Sun,
  Moon
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Protect admin routes - redirect non-admin users
    if (!isLoading && isAuthenticated && user && user.role !== 'ADMIN') {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, isLoading]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Global Scenarios', href: '/admin/scenarios', icon: Layers },
    { name: 'Scenario Assignments', href: '/admin/scenario-assignments', icon: UserCog },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950' : 'bg-stone-50'
    }`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`fixed top-4 left-4 z-50 lg:hidden rounded-lg p-2 shadow-lg transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 shadow-emerald-900/20'
            : 'bg-white border border-stone-200 hover:bg-stone-50 shadow-stone-900/10'
        }`}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`} />
        ) : (
          <Menu className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`} />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            theme === 'dark' ? 'bg-black/70 backdrop-blur-md' : 'bg-black/30 backdrop-blur-sm'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex h-full flex-col shadow-2xl transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-slate-900/95 backdrop-blur-xl border-r border-white/10'
            : 'bg-gradient-to-b from-slate-50 to-stone-100 border-r border-stone-200'
        }`}>
          {/* Logo/Brand */}
          <div className={`flex h-20 items-center justify-center border-b px-6 ${
            theme === 'dark'
              ? 'border-white/10 bg-gradient-to-r from-emerald-600 to-emerald-700'
              : 'border-stone-200 bg-gradient-to-r from-emerald-600 to-emerald-700'
          }`}>
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-lg shadow-emerald-900/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-lg">Admin Panel</h1>
                <p className="text-xs text-emerald-100">Saad Traders</p>
              </div>
            </Link>
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
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                      : theme === 'dark'
                      ? 'text-stone-300 hover:bg-white/10 hover:text-emerald-300 backdrop-blur-sm'
                      : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    isActive
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'text-stone-400 group-hover:text-emerald-400'
                      : 'text-stone-500 group-hover:text-emerald-600'
                  }`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className={`border-t p-4 space-y-3 ${
            theme === 'dark' ? 'border-white/10' : 'border-stone-200'
          }`}>
            <div className={`rounded-xl p-4 border shadow-lg transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-emerald-900/20'
                : 'bg-white border-stone-200 shadow-stone-900/5'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-900/30">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold truncate ${
                    theme === 'dark' ? 'text-white' : 'text-stone-900'
                  }`}>{user?.name}</p>
                  <p className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                  }`}>Admin</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className={`flex items-center truncate ${
                  theme === 'dark' ? 'text-stone-300/85' : 'text-stone-600'
                }`}>
                  <Mail className={`h-3 w-3 mr-1.5 flex-shrink-0 ${
                    theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                  }`} />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative w-full flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:via-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-900/40 hover:shadow-xl hover:shadow-amber-900/60'
                  : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-900/30 hover:shadow-xl hover:shadow-indigo-900/50'
              }`}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              
              <div className="relative flex items-center space-x-3">
                {theme === 'dark' ? (
                  <>
                    <div className="relative">
                      <Sun className="h-5 w-5 group-hover:rotate-180 group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute inset-0 blur-md bg-yellow-300/50 group-hover:bg-yellow-200/70 transition-all duration-300" />
                    </div>
                    <span className="font-bold tracking-wide">Light Mode</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Moon className="h-5 w-5 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute inset-0 blur-md bg-indigo-300/50 group-hover:bg-indigo-200/70 transition-all duration-300" />
                    </div>
                    <span className="font-bold tracking-wide">Dark Mode</span>
                  </>
                )}
              </div>
            </button>
            
            <button
              onClick={() => logout('/')}
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
        <header className={`sticky top-0 z-30 flex h-16 lg:h-20 items-center justify-between border-b px-4 sm:px-6 lg:px-8 shadow-lg transition-colors duration-300 ${
          theme === 'dark'
            ? 'border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-emerald-900/10'
            : 'border-stone-200 bg-white/80 backdrop-blur-xl shadow-stone-900/5'
        }`}>
          {/* Mobile: Add padding for menu button */}
          <div className="lg:hidden w-12"></div>
          
          <div className="flex-1 lg:flex-none">
            <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors duration-300 ${
              theme === 'dark'
                ? 'text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'text-stone-900'
            }`}>
              {pathname === '/admin' 
                ? 'Dashboard' 
                : pathname === '/admin/users' 
                ? 'User Management' 
                : pathname === '/admin/scenarios'
                ? 'Global Scenarios'
                : pathname === '/admin/scenario-assignments'
                ? 'Scenario Assignments'
                : 'Admin Panel'}
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 hidden sm:block transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
            }`}>
              {pathname === '/admin' 
                ? 'Welcome back! Here\'s your overview' 
                : pathname === '/admin/users' 
                ? 'Manage system users and permissions' 
                : pathname === '/admin/scenarios'
                ? 'Manage the global scenario catalog'
                : pathname === '/admin/scenario-assignments'
                ? 'Assign scenarios to users'
                : 'Manage your platform'}
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <div className={`text-right px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg border shadow-lg transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-white/10 backdrop-blur-sm border-white/10 shadow-emerald-900/20'
                : 'bg-stone-50 border-stone-200 shadow-stone-900/5'
            }`}>
              <p className={`text-xs lg:text-sm font-semibold truncate max-w-[120px] lg:max-w-none ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{user?.name}</p>
              <p className={`text-xs font-medium ${
                theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
              }`}>Admin</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
