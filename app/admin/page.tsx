'use client';

import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Users', value: '—', icon: '👥', href: '/admin/users', color: 'bg-blue-500' },
    { name: 'Active Users', value: '—', icon: '✅', href: '/admin/users', color: 'bg-green-500' },
    { name: 'Invoices', value: '—', icon: '📄', href: '#', color: 'bg-purple-500' },
    { name: 'Revenue', value: '—', icon: '💰', href: '#', color: 'bg-yellow-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
          <p className="mt-2 text-blue-100">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${stat.color} text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300 group-hover:w-full"></div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/users"
              className="flex items-center rounded-lg border-2 border-gray-200 p-4 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="mr-3 text-2xl">👥</span>
              <div>
                <p className="font-semibold text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-600">View and edit users</p>
              </div>
            </Link>
            <Link
              href="/admin/users?action=create"
              className="flex items-center rounded-lg border-2 border-gray-200 p-4 hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <span className="mr-3 text-2xl">➕</span>
              <div>
                <p className="font-semibold text-gray-900">Create User</p>
                <p className="text-sm text-gray-600">Add a new user</p>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center rounded-lg border-2 border-gray-200 p-4 hover:border-purple-500 hover:bg-purple-50 transition-all"
            >
              <span className="mr-3 text-2xl">🌐</span>
              <div>
                <p className="font-semibold text-gray-900">View Website</p>
                <p className="text-sm text-gray-600">Go to main site</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-gray-900">System Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">Your Role</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Business Name</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{user?.businessName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Province</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{user?.province || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
