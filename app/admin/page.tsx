'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Users, UserCheck, FileText, DollarSign, ArrowRight, UserPlus, Globe, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { 
      name: 'Total Users', 
      value: '—', 
      icon: Users, 
      href: '/admin/users', 
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      trend: '+12%'
    },
    { 
      name: 'Active Users', 
      value: '—', 
      icon: UserCheck, 
      href: '/admin/users', 
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      trend: '+8%'
    },
    { 
      name: 'Invoices', 
      value: '—', 
      icon: FileText, 
      href: '#', 
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      trend: '+15%'
    },
    { 
      name: 'Revenue', 
      value: '—', 
      icon: DollarSign, 
      href: '#', 
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
      trend: '+23%'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 lg:p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Welcome back, {user?.name}! 👋</h2>
            <p className="mt-2 text-blue-100 text-sm sm:text-base lg:text-lg">
              Here's what's happening with your platform today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                href={stat.href}
                className="group relative overflow-hidden rounded-xl lg:rounded-2xl bg-white p-5 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-transparent"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.name}</p>
                    <p className="mt-2 lg:mt-3 text-3xl lg:text-4xl font-bold text-slate-900">{stat.value}</p>
                    <div className="mt-2 lg:mt-3 flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-semibold text-emerald-600">{stat.trend}</span>
                      <span className="text-xs text-slate-500 hidden sm:inline">vs last month</span>
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 lg:h-7 lg:w-7 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${stat.gradient} transition-all duration-300 group-hover:w-full rounded-full`}></div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl lg:rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Quick Actions</h3>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/users"
              className="group flex items-center rounded-lg lg:rounded-xl border-2 border-slate-200 p-4 lg:p-5 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="font-bold text-slate-900 text-base sm:text-lg">Manage Users</p>
                <p className="text-xs sm:text-sm text-slate-600 flex items-center mt-0.5 sm:mt-1">
                  View and edit users
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </p>
              </div>
            </Link>
            <Link
              href="/admin/users?action=create"
              className="group flex items-center rounded-lg lg:rounded-xl border-2 border-slate-200 p-4 lg:p-5 hover:border-emerald-500 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="font-bold text-slate-900 text-base sm:text-lg">Create User</p>
                <p className="text-xs sm:text-sm text-slate-600 flex items-center mt-0.5 sm:mt-1">
                  Add a new user
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </p>
              </div>
            </Link>
            <Link
              href="/"
              className="group flex items-center rounded-lg lg:rounded-xl border-2 border-slate-200 p-4 lg:p-5 hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="font-bold text-slate-900 text-base sm:text-lg">View Website</p>
                <p className="text-xs sm:text-sm text-slate-600 flex items-center mt-0.5 sm:mt-1">
                  Go to main site
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-xl lg:rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">System Information</h3>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Your Role</p>
              <p className="mt-2 text-lg sm:text-xl font-bold text-slate-900">{user?.role}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Email</p>
              <p className="mt-2 text-lg sm:text-xl font-bold text-slate-900 truncate">{user?.email}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Business Name</p>
              <p className="mt-2 text-lg sm:text-xl font-bold text-slate-900">{user?.businessName || 'N/A'}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Province</p>
              <p className="mt-2 text-lg sm:text-xl font-bold text-slate-900">{user?.province || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
