'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { Users, UserCheck, FileText, DollarSign, ArrowRight, UserPlus, Globe, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const stats = [
    { 
      name: 'Total Users', 
      value: '—', 
      icon: Users, 
      href: '/admin/users', 
      gradient: 'from-emerald-600 to-emerald-700',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      borderColor: 'hover:border-emerald-500',
      trend: '+12%'
    },
    { 
      name: 'Active Users', 
      value: '—', 
      icon: UserCheck, 
      href: '/admin/users', 
      gradient: 'from-blue-900 to-blue-950',
      bgGradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-900',
      borderColor: 'hover:border-blue-900',
      trend: '+8%'
    },
    { 
      name: 'Invoices', 
      value: '—', 
      icon: FileText, 
      href: '#', 
      gradient: 'from-amber-600 to-amber-700',
      bgGradient: 'from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'hover:border-amber-600',
      trend: '+15%'
    },
    { 
      name: 'Revenue', 
      value: '—', 
      icon: DollarSign, 
      href: '#', 
      gradient: 'from-emerald-700 to-emerald-800',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-700',
      borderColor: 'hover:border-emerald-700',
      trend: '+23%'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border p-8 lg:p-10 shadow-2xl transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-slate-900/50 border-white/10 shadow-emerald-900/20' 
            : 'bg-white border-stone-200 shadow-stone-900/5'
        }`}>
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDJ2LTJoLTJ2MnptMC00aDJ2LTJoLTJ2MnptMCA4aDJ2LTJoLTJ2MnptLTQgMGgydi0yaC0ydjJ6bS00IDBoMnYtMmgtMnYyem04LThoMnYtMmgtMnYyem0wLTRoMnYtMmgtMnYyem0wIDhoMnYtMmgtMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-stone-900'
            }`}>Welcome back, {user?.name}! 👋</h2>
            <p className={`mt-3 text-base sm:text-lg lg:text-xl transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-200/85' : 'text-stone-700'
            }`}>
              Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                href={stat.href}
                className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl border p-6 lg:p-7 shadow-lg hover:shadow-2xl hover:border-emerald-400/30 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 shadow-emerald-900/20 hover:shadow-emerald-900/30' 
                    : 'bg-white border-stone-200 shadow-stone-900/5 hover:shadow-stone-900/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
                    }`}>{stat.name}</p>
                    <p className={`mt-3 lg:mt-4 text-4xl lg:text-5xl font-bold transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-stone-900'
                    }`}>{stat.value}</p>
                    <div className="mt-3 lg:mt-4 flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-bold text-emerald-400">{stat.trend}</span>
                      <span className="text-xs text-stone-400 hidden sm:inline">vs last month</span>
                    </div>
                  </div>
                  <div className="flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 lg:h-8 lg:w-8 text-emerald-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 lg:p-10 shadow-lg transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 shadow-emerald-900/20' 
            : 'bg-white border-stone-200 shadow-stone-900/5'
        }`}>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-stone-900'
            }`}>Quick Actions</h3>
            <div className="h-1.5 w-20 sm:w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/users"
              className={`group flex items-center rounded-xl lg:rounded-2xl border p-5 lg:p-6 hover:border-emerald-400/30 hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                theme === 'dark' 
                  ? 'border-white/10 bg-white/5 hover:shadow-emerald-900/20' 
                  : 'border-stone-200 bg-stone-50 hover:shadow-stone-900/10'
              }`}
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-all duration-300">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="ml-4 sm:ml-5">
                <p className={`font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>Manage Users</p>
                <p className={`text-sm sm:text-base flex items-center mt-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  View and edit users
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-emerald-400" />
                </p>
              </div>
            </Link>
            <Link
              href="/admin/users?action=create"
              className={`group flex items-center rounded-xl lg:rounded-2xl border p-5 lg:p-6 hover:border-cyan-400/30 hover:bg-cyan-500/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                theme === 'dark' 
                  ? 'border-white/10 bg-white/5 hover:shadow-cyan-900/20' 
                  : 'border-stone-200 bg-stone-50 hover:shadow-stone-900/10'
              }`}
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-900/30 group-hover:scale-110 transition-all duration-300">
                <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="ml-4 sm:ml-5">
                <p className={`font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>Create User</p>
                <p className={`text-sm sm:text-base flex items-center mt-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  Add a new user
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-cyan-400" />
                </p>
              </div>
            </Link>
            <Link
              href="/"
              className={`group flex items-center rounded-xl lg:rounded-2xl border p-5 lg:p-6 hover:border-emerald-400/30 hover:bg-emerald-500/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                theme === 'dark' 
                  ? 'border-white/10 bg-white/5 hover:shadow-emerald-900/20' 
                  : 'border-stone-200 bg-stone-50 hover:shadow-stone-900/10'
              }`}
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-900/30 group-hover:scale-110 transition-all duration-300">
                <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="ml-4 sm:ml-5">
                <p className={`font-bold text-lg sm:text-xl transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>View Website</p>
                <p className={`text-sm sm:text-base flex items-center mt-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  Go to main site
                  <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-emerald-400" />
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className={`rounded-2xl backdrop-blur-xl border p-6 sm:p-8 lg:p-10 shadow-lg transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 shadow-emerald-900/20' 
            : 'bg-white border-stone-200 shadow-stone-900/5'
        }`}>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-stone-900'
            }`}>System Information</h3>
            <div className="h-1.5 w-20 sm:w-24 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"></div>
          </div>
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className={`p-6 sm:p-7 rounded-xl lg:rounded-2xl backdrop-blur-sm border hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg group ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:shadow-emerald-900/20' 
                : 'bg-stone-50 border-stone-200 hover:shadow-stone-900/10'
            }`}>
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`}>Your Role</p>
              <p className={`mt-3 text-2xl sm:text-3xl font-bold group-hover:text-emerald-300 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{user?.role}</p>
            </div>
            <div className={`p-6 sm:p-7 rounded-xl lg:rounded-2xl backdrop-blur-sm border hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg group ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:shadow-cyan-900/20' 
                : 'bg-stone-50 border-stone-200 hover:shadow-stone-900/10'
            }`}>
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`}>Email</p>
              <p className={`mt-3 text-xl sm:text-2xl font-bold truncate group-hover:text-cyan-300 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{user?.email}</p>
            </div>
            <div className={`p-6 sm:p-7 rounded-xl lg:rounded-2xl backdrop-blur-sm border hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg group ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:shadow-emerald-900/20' 
                : 'bg-stone-50 border-stone-200 hover:shadow-stone-900/10'
            }`}>
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`}>Business Name</p>
              <p className={`mt-3 text-xl sm:text-2xl font-bold group-hover:text-emerald-300 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{user?.businessName || 'N/A'}</p>
            </div>
            <div className={`p-6 sm:p-7 rounded-xl lg:rounded-2xl backdrop-blur-sm border hover:border-emerald-400/30 transition-all duration-300 hover:shadow-lg group ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 hover:shadow-emerald-900/20' 
                : 'bg-stone-50 border-stone-200 hover:shadow-stone-900/10'
            }`}>
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`}>Province</p>
              <p className={`mt-3 text-xl sm:text-2xl font-bold group-hover:text-emerald-300 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{user?.province || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
