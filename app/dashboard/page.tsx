'use client';

import UserLayout from '@/components/layouts/UserLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import Link from 'next/link';
import { Users, Package, FileBarChart, ArrowRight, Plus, CheckCircle, AlertCircle, TrendingUp, Building2, MapPin } from 'lucide-react';
import { useEffect } from 'react';

export default function UserDashboard() {
  const { user } = useAuth();
  const { resetLoading } = useLoading();

  // Clear loading state when dashboard mounts
  useEffect(() => {
    resetLoading();
  }, [resetLoading]);

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Submit new invoice to FBR',
      href: '/dashboard/invoices?action=create',
      icon: FileBarChart,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Add Buyer',
      description: 'Register new buyer',
      href: '/dashboard/buyers?action=create',
      icon: Users,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
    },
    {
      title: 'Add HS Code',
      description: 'Add product HS code',
      href: '/dashboard/hs-codes?action=create',
      icon: Package,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
  ];

  const stats = [
    { name: 'Total Buyers', value: '—', icon: Users, gradient: 'from-blue-500 to-blue-600', bgGradient: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600' },
    { name: 'HS Codes', value: '—', icon: Package, gradient: 'from-emerald-500 to-emerald-600', bgGradient: 'from-emerald-50 to-emerald-100', iconColor: 'text-emerald-600' },
    { name: 'Total Invoices', value: '—', icon: FileBarChart, gradient: 'from-purple-500 to-purple-600', bgGradient: 'from-purple-50 to-purple-100', iconColor: 'text-purple-600' },
  ];

  return (
    <UserLayout>
      <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 lg:p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Welcome back, {user?.name}! 👋</h2>
            <p className="mt-2 text-blue-100 text-sm sm:text-base lg:text-lg">
              Manage your invoices and FBR submissions efficiently.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="group relative overflow-hidden rounded-xl lg:rounded-2xl bg-white p-5 lg:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-transparent"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.name}</p>
                    <p className="mt-2 lg:mt-3 text-3xl lg:text-4xl font-bold text-slate-900">{stat.value}</p>
                    <div className="mt-2 lg:mt-3 flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">View all</span>
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bgGradient} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 lg:h-7 lg:w-7 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${stat.gradient} transition-all duration-300 group-hover:w-full rounded-full`}></div>
              </div>
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
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center rounded-lg lg:rounded-xl border-2 border-slate-200 p-4 lg:p-5 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:shadow-lg"
                >
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br ${action.gradient} shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-base sm:text-lg truncate">{action.title}</p>
                    <p className="text-xs sm:text-sm text-slate-600 flex items-center mt-0.5 sm:mt-1 truncate">
                      {action.description}
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Business Info */}
        <div className="rounded-xl lg:rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Your Business Information</h3>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Business Name</p>
              <p className="mt-2 text-base sm:text-lg lg:text-xl font-bold text-slate-900 flex items-center">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                {user?.businessName}
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Province</p>
              <p className="mt-2 text-base sm:text-lg lg:text-xl font-bold text-slate-900 flex items-center">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                {user?.province}
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">NTN/CNIC</p>
              <p className="mt-2 text-base sm:text-lg lg:text-xl font-bold text-slate-900">{user?.ntncnic}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Address</p>
              <p className="mt-2 text-sm sm:text-base lg:text-lg font-bold text-slate-900 truncate">{user?.address}</p>
            </div>
          </div>
        </div>

        {/* FBR Integration Status */}
        <div className="rounded-xl lg:rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">FBR Integration Status</h3>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl border-2 border-slate-200 hover:border-emerald-500 transition-colors duration-200">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Test Environment</p>
                {user?.postInvoiceTokenTest && user?.validateInvoiceTokenTest ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-700">
                {user?.postInvoiceTokenTest && user?.validateInvoiceTokenTest 
                  ? 'Configured ✓' 
                  : 'Not configured'}
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded-lg lg:rounded-xl border-2 border-slate-200 hover:border-blue-500 transition-colors duration-200">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Production Environment</p>
                {user?.postInvoiceToken && user?.validateInvoiceToken ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-700">
                {user?.postInvoiceToken && user?.validateInvoiceToken 
                  ? 'Configured ✓' 
                  : 'Not configured'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
