'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { CreateUserRequest, UpdateUserRequest } from '@/services/user.service';
import type { User } from '@/types/api';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useToggleUserStatus, useUpdateUserPassword } from '@/hooks/useUsers';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Key, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
  Mail,
  Building2,
  MapPin,
  CreditCard,
  Lock,
  KeyRound,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir',
];

export default function UsersPage() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFbrTokensCreate, setShowFbrTokensCreate] = useState(false);
  const [showFbrTokensEdit, setShowFbrTokensEdit] = useState(false);

  // Form states
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    businessName: '',
    province: '',
    address: '',
    ntncnic: '',
    password: '',
    postInvoiceTokenTest: '',
    validateInvoiceTokenTest: '',
    postInvoiceToken: '',
    validateInvoiceToken: '',
  });
  const [newPassword, setNewPassword] = useState('');

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: 10,
    };
    if (searchTerm) params.search = searchTerm;
    if (roleFilter !== 'ALL') params.role = roleFilter;
    if (statusFilter !== 'ALL') params.isActive = statusFilter === 'ACTIVE';
    return params;
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  // React Query hooks
  const { data, isLoading } = useUsers(queryParams);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const toggleStatus = useToggleUserStatus();
  const updatePassword = useUpdateUserPassword();

  const users = data?.data.users || [];
  const totalUsers = data?.data.pagination.total || 0;
  const totalPages = data?.data.pagination.totalPages || 1;

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser.mutateAsync(formData);
    setShowCreateModal(false);
    resetForm();
  };

  // Update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const updateData: UpdateUserRequest = {
      name: formData.name,
      email: formData.email,
      businessName: formData.businessName,
      province: formData.province,
      address: formData.address,
      ntncnic: formData.ntncnic,
      postInvoiceTokenTest: formData.postInvoiceTokenTest,
      validateInvoiceTokenTest: formData.validateInvoiceTokenTest,
      postInvoiceToken: formData.postInvoiceToken,
      validateInvoiceToken: formData.validateInvoiceToken,
    };
    
    await updateUser.mutateAsync({ id: selectedUser.id, data: updateData });
    setShowEditModal(false);
    resetForm();
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    await deleteUser.mutateAsync(selectedUser.id);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Toggle user status
  const handleToggleStatus = async (user: User) => {
    await toggleStatus.mutateAsync(user.id);
  };

  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    await updatePassword.mutateAsync({ id: selectedUser.id, password: newPassword });
    setShowPasswordModal(false);
    setNewPassword('');
    setSelectedUser(null);
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      businessName: '',
      province: '',
      address: '',
      ntncnic: '',
      password: '',
      postInvoiceTokenTest: '',
      validateInvoiceTokenTest: '',
      postInvoiceToken: '',
      validateInvoiceToken: '',
    });
    setSelectedUser(null);
    setShowFbrTokensCreate(false);
    setShowFbrTokensEdit(false);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      businessName: user.businessName || '',
      province: user.province || '',
      address: user.address || '',
      ntncnic: user.ntncnic || '',
      password: '',
      postInvoiceTokenTest: user.postInvoiceTokenTest || '',
      validateInvoiceTokenTest: user.validateInvoiceTokenTest || '',
      postInvoiceToken: user.postInvoiceToken || '',
      validateInvoiceToken: user.validateInvoiceToken || '',
    });
    // Auto-expand FBR tokens if user already has tokens
    const hasTokens = user.postInvoiceTokenTest || user.validateInvoiceTokenTest || 
                     user.postInvoiceToken || user.validateInvoiceToken;
    setShowFbrTokensEdit(!!hasTokens);
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-stone-900'
            }`}>User Management</h2>
            <p className={`mt-1.5 sm:mt-2 text-xs sm:text-sm flex items-center transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-200/85' : 'text-stone-700'
            }`}>
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-emerald-400" />
              Manage all platform users and permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 group"
          >
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Create User
          </button>
        </div>

        {/* Filters */}
        <div className={`rounded-xl sm:rounded-2xl backdrop-blur-xl border p-4 sm:p-6 shadow-lg transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 shadow-emerald-900/20' 
            : 'bg-white border-stone-200 shadow-stone-900/5'
        }`}>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className={`block text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>Search</label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
                }`} />
                <input
                  type="text"
                  placeholder="Search by name, email, or business..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`w-full rounded-lg sm:rounded-xl backdrop-blur-sm border-2 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400' 
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className={`block text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>Role</label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as 'ALL' | 'ADMIN' | 'USER');
                  setCurrentPage(1);
                }}
                className={`w-full rounded-lg sm:rounded-xl backdrop-blur-sm border-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : 'bg-white border-stone-300 text-stone-900'
                }`}
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className={`block text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
              }`}>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE');
                  setCurrentPage(1);
                }}
                className={`w-full rounded-lg sm:rounded-xl backdrop-blur-sm border-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : 'bg-white border-stone-300 text-stone-900'
                }`}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className={`mt-4 sm:mt-5 flex items-center justify-between border-t pt-4 sm:pt-5 transition-colors duration-300 ${
            theme === 'dark' ? 'border-white/10' : 'border-stone-200'
          }`}>
            <p className={`text-xs sm:text-sm flex items-center transition-colors duration-300 ${
              theme === 'dark' ? 'text-stone-200/85' : 'text-stone-700'
            }`}>
              <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-emerald-400" />
              Showing <span className={`font-bold mx-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{users.length}</span> of{' '}
              <span className={`font-bold ml-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>{totalUsers}</span> users
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-xl sm:rounded-2xl backdrop-blur-xl border shadow-lg overflow-hidden transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 shadow-emerald-900/20' 
            : 'bg-white border-stone-200 shadow-stone-900/5'
        }`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-lg"></div>
              <p className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
              }`}>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <UserIcon className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
              }`} />
              <p className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
              }`}>No users found</p>
              <p className={`text-xs sm:text-sm mt-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`}>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className={`backdrop-blur-sm border-b-2 transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-stone-50 border-stone-200'
                }`}>
                  <tr>
                    <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                    }`}>
                      User
                    </th>
                    <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                    }`}>
                      Business
                    </th>
                    <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                    }`}>
                      Role
                    </th>
                    <th className={`px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider hidden sm:table-cell transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                    }`}>
                      Status
                    </th>
                    <th className={`px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-300 ${
                  theme === 'dark' ? 'divide-white/10' : 'divide-stone-200'
                }`}>
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:bg-white/5 transition-all duration-200 group ${
                      theme === 'dark' ? '' : 'hover:bg-stone-50'
                    }`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-900/30">
                            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm sm:text-base truncate transition-colors duration-300 ${
                              theme === 'dark' ? 'text-white' : 'text-stone-900'
                            }`}>{user.name}</p>
                            <p className={`text-xs sm:text-sm flex items-center truncate transition-colors duration-300 ${
                              theme === 'dark' ? 'text-stone-300/85' : 'text-stone-600'
                            }`}>
                              <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div>
                          <p className={`font-medium flex items-center text-sm sm:text-base transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-stone-900'
                          }`}>
                            <Building2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0 transition-colors duration-300 ${
                              theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
                            }`} />
                            <span className="truncate">{user.businessName || 'N/A'}</span>
                          </p>
                          <p className={`text-xs sm:text-sm flex items-center mt-1 transition-colors duration-300 ${
                            theme === 'dark' ? 'text-stone-300/85' : 'text-stone-600'
                          }`}>
                            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{user.province || 'N/A'}</span>
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold shadow-sm ${
                            user.role === 'ADMIN'
                              ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300'
                              : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                          }`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md ${
                            user.isActive
                              ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 hover:from-emerald-200 hover:to-emerald-300 border border-emerald-300'
                              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300 border border-red-300'
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="Edit user"
                          >
                            <Edit className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => openPasswordModal(user)}
                            className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="Change password"
                          >
                            <Key className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                            <span className="hidden sm:inline">Password</span>
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                              title="Delete user"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 border-t backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 transition-colors duration-300 ${
              theme === 'dark' 
                ? 'border-white/10 bg-white/5' 
                : 'border-stone-200 bg-stone-50'
            }`}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hover:border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md group ${
                  theme === 'dark' 
                    ? 'border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:hover:bg-white/5 disabled:hover:border-white/20' 
                    : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-50 disabled:hover:bg-white disabled:hover:border-stone-300'
                }`}
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                Previous
              </button>
              <span className={`text-xs sm:text-sm font-semibold backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border shadow-sm transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'text-white bg-white/10 border-white/20' 
                  : 'text-stone-900 bg-white border-stone-300'
              }`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold hover:border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md group ${
                  theme === 'dark' 
                    ? 'border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:hover:bg-white/5 disabled:hover:border-white/20' 
                    : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-50 disabled:hover:bg-white disabled:hover:border-stone-300'
                }`}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-3 sm:p-4 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-black/70' : 'bg-black/40'
        }`}>
          <div className={`max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl sm:rounded-2xl backdrop-blur-xl shadow-2xl border transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-slate-900/95 border-white/10' 
              : 'bg-white border-stone-200'
          }`}>
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b border-white/10">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Create New User</h3>
              </div>
            </div>
            <form onSubmit={handleCreateUser} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <div>
                  <label className={`flex items-center text-sm font-semibold mb-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                  }`}>
                    <UserIcon className="h-4 w-4 mr-1.5 text-emerald-400" />
                    Name <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-xl backdrop-blur-sm border-2 px-4 py-2.5 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/20 text-white placeholder-stone-400' 
                        : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-stone-300 mb-2">
                    <Mail className="h-4 w-4 mr-1.5 text-emerald-400" />
                    Email <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-2.5 text-white placeholder-stone-400 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-stone-300 mb-2">
                    <Building2 className="h-4 w-4 mr-1.5 text-emerald-400" />
                    Business Name <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-2.5 text-white placeholder-stone-400 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-stone-300 mb-2">
                    <MapPin className="h-4 w-4 mr-1.5 text-emerald-400" />
                    Province <span className="text-red-400 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-2.5 text-white focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  >
                    <option value="">Select Province</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-stone-300 mb-2">
                    <MapPin className="h-4 w-4 mr-1.5 text-emerald-400" />
                    Address <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-2.5 text-white placeholder-stone-400 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-stone-300 mb-2">
                    <CreditCard className="h-4 w-4 mr-1.5 text-emerald-400" />
                    NTN/CNIC <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ntncnic}
                    onChange={(e) => setFormData({ ...formData, ntncnic: e.target.value })}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-2.5 text-white placeholder-stone-400 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-stone-300 mb-2">
                    <Lock className="h-4 w-4 mr-1.5 text-emerald-400" />
                    Password <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-2.5 text-white placeholder-stone-400 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                  <p className="mt-2 text-xs text-stone-400 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Min. 8 characters with uppercase, lowercase, number & special char
                  </p>
                </div>
              </div>

              {/* FBR Token Fields Section - Collapsible */}
              <div className="border-t border-white/10 pt-5 mt-5">
                <button
                  type="button"
                  onClick={() => setShowFbrTokensCreate(!showFbrTokensCreate)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 backdrop-blur-sm transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <KeyRound className="h-5 w-5 mr-3 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-left">
                      <h4 className="text-base font-bold text-white">FBR API Tokens</h4>
                      <p className="text-xs text-stone-300 mt-0.5">Optional - Click to {showFbrTokensCreate ? 'hide' : 'add'} token credentials</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">Optional</span>
                    {showFbrTokensCreate ? (
                      <ChevronUp className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                {showFbrTokensCreate && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 bg-gradient-to-br from-slate-50 to-indigo-50 p-5 rounded-xl border-2 border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-indigo-600" />
                        Post Invoice Token (Test)
                      </label>
                      <input
                        type="text"
                        value={formData.postInvoiceTokenTest || ''}
                        onChange={(e) => setFormData({ ...formData, postInvoiceTokenTest: e.target.value })}
                        placeholder="Enter test environment token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-indigo-600" />
                        Validate Invoice Token (Test)
                      </label>
                      <input
                        type="text"
                        value={formData.validateInvoiceTokenTest || ''}
                        onChange={(e) => setFormData({ ...formData, validateInvoiceTokenTest: e.target.value })}
                        placeholder="Enter test validation token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-emerald-600" />
                        Post Invoice Token (Production)
                      </label>
                      <input
                        type="text"
                        value={formData.postInvoiceToken || ''}
                        onChange={(e) => setFormData({ ...formData, postInvoiceToken: e.target.value })}
                        placeholder="Enter production token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-emerald-600" />
                        Validate Invoice Token (Production)
                      </label>
                      <input
                        type="text"
                        value={formData.validateInvoiceToken || ''}
                        onChange={(e) => setFormData({ ...formData, validateInvoiceToken: e.target.value })}
                        placeholder="Enter production validation token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-500 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        FBR API tokens are optional. Add them only if you have received them from FBR.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t-2 border-slate-200 mt-6">
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  {createUser.isPending ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-2xl border-b-2 border-indigo-700">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Edit User</h3>
              </div>
            </div>
            <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <UserIcon className="h-4 w-4 mr-1.5 text-indigo-600" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <Mail className="h-4 w-4 mr-1.5 text-indigo-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <Building2 className="h-4 w-4 mr-1.5 text-indigo-600" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="h-4 w-4 mr-1.5 text-indigo-600" />
                    Province
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  >
                    <option value="">Select Province</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <MapPin className="h-4 w-4 mr-1.5 text-indigo-600" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <CreditCard className="h-4 w-4 mr-1.5 text-indigo-600" />
                    NTN/CNIC
                  </label>
                  <input
                    type="text"
                    value={formData.ntncnic}
                    onChange={(e) => setFormData({ ...formData, ntncnic: e.target.value })}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* FBR Token Fields Section - Collapsible */}
              <div className="border-t-2 border-slate-200 pt-5 mt-5">
                <button
                  type="button"
                  onClick={() => setShowFbrTokensEdit(!showFbrTokensEdit)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-2 border-purple-200 transition-all duration-200 group"
                >
                  <div className="flex items-center">
                    <KeyRound className="h-5 w-5 mr-3 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    <div className="text-left">
                      <h4 className="text-base font-bold text-slate-900">FBR API Tokens</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Optional - Click to {showFbrTokensEdit ? 'hide' : 'update'} token credentials</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-purple-600 bg-white px-2 py-1 rounded-full">Optional</span>
                    {showFbrTokensEdit ? (
                      <ChevronUp className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                {showFbrTokensEdit && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 bg-gradient-to-br from-slate-50 to-purple-50 p-5 rounded-xl border-2 border-purple-100 animate-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-purple-600" />
                        Post Invoice Token (Test)
                      </label>
                      <input
                        type="text"
                        value={formData.postInvoiceTokenTest || ''}
                        onChange={(e) => setFormData({ ...formData, postInvoiceTokenTest: e.target.value })}
                        placeholder="Enter test environment token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-purple-600" />
                        Validate Invoice Token (Test)
                      </label>
                      <input
                        type="text"
                        value={formData.validateInvoiceTokenTest || ''}
                        onChange={(e) => setFormData({ ...formData, validateInvoiceTokenTest: e.target.value })}
                        placeholder="Enter test validation token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-emerald-600" />
                        Post Invoice Token (Production)
                      </label>
                      <input
                        type="text"
                        value={formData.postInvoiceToken || ''}
                        onChange={(e) => setFormData({ ...formData, postInvoiceToken: e.target.value })}
                        placeholder="Enter production token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                        <KeyRound className="h-4 w-4 mr-1.5 text-emerald-600" />
                        Validate Invoice Token (Production)
                      </label>
                      <input
                        type="text"
                        value={formData.validateInvoiceToken || ''}
                        onChange={(e) => setFormData({ ...formData, validateInvoiceToken: e.target.value })}
                        placeholder="Enter production validation token"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-slate-500 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        FBR API tokens are optional. Update them only if you have new tokens from FBR.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t-2 border-slate-200 mt-6">
                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  {updateUser.isPending ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 rounded-t-2xl border-b-2 border-red-700">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Delete User</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 text-lg">
                Are you sure you want to delete <strong className="text-slate-900">{selectedUser.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteUser.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  {deleteUser.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-6 rounded-t-2xl border-b-2 border-amber-700">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Update Password</h3>
              </div>
            </div>
            <div className="p-8">
              <p className="text-sm text-slate-600 mb-6">
                Update password for <strong className="text-slate-900">{selectedUser.name}</strong>
              </p>
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-6">
                  <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <Lock className="h-4 w-4 mr-1.5 text-amber-600" />
                    New Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                    placeholder="Enter new password"
                  />
                  <p className="mt-2 text-xs text-slate-500 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Min. 8 characters with uppercase, lowercase, number & special char
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={updatePassword.isPending}
                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-semibold text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Key className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setNewPassword('');
                      setSelectedUser(null);
                    }}
                    className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
