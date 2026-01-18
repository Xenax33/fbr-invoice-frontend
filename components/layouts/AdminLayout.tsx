'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
  UserCog
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Protect admin routes - redirect non-admin users
    if (isAuthenticated && user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Global Scenarios', href: '/admin/scenarios', icon: Layers },
    { name: 'Scenario Assignments', href: '/admin/scenario-assignments', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-slate-900 p-2 text-white shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
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
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
              <Shield className="h-7 w-7 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="block text-white font-bold text-xl tracking-tight">Admin Panel</span>
              <span className="block text-blue-400 text-xs font-medium">Saad Traders</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors`} />
                    {item.name}
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-white animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 bg-slate-900/70 backdrop-blur-sm p-5">
          <div className="mb-4 px-2">
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 flex items-center mt-0.5">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="truncate">{user?.email}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => logout('/')}
            className="w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 group"
          >
            <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            Logout
          </button>
          <Link
            href="/"
            className="mt-2.5 flex items-center justify-center w-full rounded-lg border-2 border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800/50 hover:border-blue-500 hover:text-white transition-all duration-200 group"
          >
            <Globe className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            Back to Website
          </Link>
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
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
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
            <div className="text-right px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs lg:text-sm font-semibold text-slate-900 truncate max-w-[120px] lg:max-w-none">{user?.name}</p>
              <p className="text-xs text-blue-600 font-medium">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
