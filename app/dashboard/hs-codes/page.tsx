'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import UserLayout from '@/components/layouts/UserLayout';
import { useHSCodes, useCreateHSCode, useDeleteHSCode } from '@/hooks/useHSCodes';
import type { HSCode, CreateHSCodeRequest } from '@/types/api';
import { fbrHSCodeService, type FBRHSCode } from '@/services/fbrHSCode.service';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Trash2,
  Package,
  Hash,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function HSCodesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFBRModal, setShowFBRModal] = useState(false);
  const [selectedHSCode, setSelectedHSCode] = useState<HSCode | null>(null);

  // FBR HS Codes states
  const [fbrHSCodes, setFbrHSCodes] = useState<FBRHSCode[]>([]);
  const [fbrSearch, setFbrSearch] = useState('');
  const [debouncedFbrSearch, setDebouncedFbrSearch] = useState('');
  const [isFetchingFBR, setIsFetchingFBR] = useState(false);
  const [isFilteringFBR, setIsFilteringFBR] = useState(false);
  const [selectedFBRCodes, setSelectedFBRCodes] = useState<Set<string>>(new Set());
  const [displayedCodesCount, setDisplayedCodesCount] = useState(50); // Initial display limit

  // Form states
  const [formData, setFormData] = useState<CreateHSCodeRequest>({
    hsCode: '',
    description: '',
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      limit: 10,
    };
    if (searchTerm) params.search = searchTerm;
    return params;
  }, [currentPage, searchTerm]);

  // React Query hooks
  const { data, isLoading } = useHSCodes(queryParams);
  const createHSCode = useCreateHSCode();
  const deleteHSCode = useDeleteHSCode();

  const hsCodes = data?.data || [];
  const totalHSCodes = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;

  // Fetch FBR HS Codes
  const fetchFBRHSCodes = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    // Use production token if available, otherwise test token
    const token = user.postInvoiceToken || user.postInvoiceTokenTest;
    
    if (!token) {
      toast.error('No FBR token available. Please contact administrator.');
      return;
    }

    setIsFetchingFBR(true);
    
    try {
      const codes = await fbrHSCodeService.getFBRHSCodes(token);
      setFbrHSCodes(codes);
      setShowFBRModal(true);
      toast.success(`Loaded ${codes.length} HS codes from FBR`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch HS codes from FBR';
      toast.error(errorMessage);
    } finally {
      setIsFetchingFBR(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFbrSearch(fbrSearch);
      setDisplayedCodesCount(50); // Reset display count when search changes
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [fbrSearch]);

  // Filter FBR HS codes based on debounced search
  const filteredFBRCodes = useMemo(() => {
    if (!debouncedFbrSearch.trim()) {
      return fbrHSCodes;
    }
    
    const searchLower = debouncedFbrSearch.toLowerCase();
    const filtered = fbrHSCodes.filter(
      (code) =>
        code.hS_CODE.toLowerCase().includes(searchLower) ||
        code.description.toLowerCase().includes(searchLower)
    );
    
    return filtered;
  }, [fbrHSCodes, debouncedFbrSearch]);

  // Manage filtering loading state
  useEffect(() => {
    if (fbrHSCodes.length > 0 && fbrSearch !== debouncedFbrSearch) {
      setIsFilteringFBR(true);
    } else {
      setIsFilteringFBR(false);
    }
  }, [fbrSearch, debouncedFbrSearch, fbrHSCodes.length]);

  // Slice filtered codes for pagination/virtual scrolling
  const displayedFBRCodes = useMemo(() => {
    return filteredFBRCodes.slice(0, displayedCodesCount);
  }, [filteredFBRCodes, displayedCodesCount]);

  // Load more codes
  const loadMoreCodes = useCallback(() => {
    setDisplayedCodesCount(prev => Math.min(prev + 50, filteredFBRCodes.length));
  }, [filteredFBRCodes.length]);

  // Toggle selection of FBR HS code
  const toggleFBRCodeSelection = (hsCode: string) => {
    const newSelection = new Set(selectedFBRCodes);
    if (newSelection.has(hsCode)) {
      newSelection.delete(hsCode);
    } else {
      newSelection.add(hsCode);
    }
    setSelectedFBRCodes(newSelection);
  };

  // Add selected FBR HS codes
  const handleAddFBRCodes = async () => {
    if (selectedFBRCodes.size === 0) {
      toast.error('Please select at least one HS code');
      return;
    }

    const codesToAdd = fbrHSCodes
      .filter((code) => selectedFBRCodes.has(code.hS_CODE))
      .map((code) => ({
        hsCode: code.hS_CODE,
        description: code.description,
      }));

    try {
      // Use bulk API endpoint
      await createHSCode.mutateAsync({
        hsCodes: codesToAdd,
      });

      // Handle response from bulk API
      // The hook already shows toast notifications based on the response
      setShowFBRModal(false);
      setSelectedFBRCodes(new Set());
      setFbrSearch('');
    } catch (error: unknown) {
      // Error already handled by the hook
      console.error('Failed to add HS codes:', error);
    }
  };

  // Create HS code
  const handleCreateHSCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await createHSCode.mutateAsync(formData);
    setShowCreateModal(false);
    resetForm();
  };

  // Open delete modal
  const openDeleteModal = (hsCode: HSCode) => {
    setSelectedHSCode(hsCode);
    setShowDeleteModal(true);
  };

  // Delete HS code
  const handleDeleteHSCode = async () => {
    if (!selectedHSCode) return;
    await deleteHSCode.mutateAsync(selectedHSCode.id);
    setShowDeleteModal(false);
    setSelectedHSCode(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      hsCode: '',
      description: '',
    });
    setSelectedHSCode(null);
  };

  return (
    <UserLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">HS Codes Management</h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 flex items-center">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Manage your product HS codes
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={fetchFBRHSCodes}
              disabled={isFetchingFBR}
              className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingFBR ? (
                <>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Import from FBR
                </>
              )}
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Add Manually
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
          <div className="grid gap-3 sm:gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by HS code or description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between border-t-2 border-slate-200 pt-4 sm:pt-5">
            <p className="text-xs sm:text-sm text-slate-600 flex items-center">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Showing <span className="font-bold text-slate-900 mx-1">{hsCodes.length}</span> of{' '}
              <span className="font-bold text-slate-900 ml-1">{totalHSCodes}</span> HS codes
            </p>
          </div>
        </div>

        {/* HS Codes Table */}
        <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium">Loading HS codes...</p>
            </div>
          ) : hsCodes.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
              <p className="text-slate-600 font-medium text-sm sm:text-base">No HS codes found</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Create your first HS code to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      HS Code
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                      Description
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {hsCodes.map((hsCode) => (
                    <tr key={hsCode.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <Hash className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="font-bold text-slate-900 text-base sm:text-lg">{hsCode.hsCode}</p>
                            <p className="text-xs sm:text-sm text-slate-600 md:hidden truncate max-w-[200px]">{hsCode.description || 'No description'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <p className="text-sm sm:text-base text-slate-700 flex items-center">
                          <FileText className="h-4 w-4 mr-1.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{hsCode.description || 'No description'}</span>
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => openDeleteModal(hsCode)}
                            className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="Delete HS code"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                Previous
              </button>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-slate-200 shadow-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create HS Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Add New HS Code</h3>
              </div>
            </div>
            <form onSubmit={handleCreateHSCode} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <Hash className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  HS Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 0000.0000"
                  value={formData.hsCode}
                  onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-slate-500">Format: XXXX.XXXX</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter description of the HS code..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createHSCode.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createHSCode.isPending ? 'Creating...' : 'Create HS Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedHSCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl sm:rounded-t-2xl border-b-2 border-red-800">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Delete HS Code</h3>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-slate-700 mb-4">
                Are you sure you want to delete HS Code <span className="font-bold text-slate-900">{selectedHSCode.hsCode}</span>?
              </p>
              <p className="text-xs sm:text-sm text-red-600 mb-4">
                This action cannot be undone. The HS code will be permanently removed.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedHSCode(null);
                  }}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteHSCode}
                  disabled={deleteHSCode.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteHSCode.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FBR HS Codes Import Modal */}
      {showFBRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-emerald-200">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-emerald-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Import HS Codes from FBR</h3>
                    <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                      Select codes to add to your collection • {filteredFBRCodes.length.toLocaleString()} codes {filteredFBRCodes.length !== fbrHSCodes.length && 'found'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowFBRModal(false);
                    setSelectedFBRCodes(new Set());
                    setFbrSearch('');
                  }}
                  className="rounded-lg bg-white/20 backdrop-blur-sm p-2 hover:bg-white/30 transition-all duration-200"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="sticky top-[88px] sm:top-[96px] lg:top-[104px] bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 lg:px-8 py-4 border-b-2 border-slate-200 backdrop-blur-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Search by HS code or description..."
                  value={fbrSearch}
                  onChange={(e) => setFbrSearch(e.target.value)}
                  className="w-full rounded-xl border-2 border-emerald-200 pl-12 pr-4 py-3 text-sm font-medium focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-slate-400"
                  autoFocus
                />
                {fbrSearch && (
                  <button
                    onClick={() => setFbrSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-200 p-1.5 hover:bg-slate-300 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 text-slate-600" />
                  </button>
                )}
              </div>
              
              {/* Selection Summary */}
              {selectedFBRCodes.size > 0 && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border-2 border-emerald-200 px-4 py-2.5">
                  <p className="text-sm font-semibold text-emerald-900">
                    <Check className="inline h-4 w-4 mr-1.5" />
                    {selectedFBRCodes.size} code{selectedFBRCodes.size !== 1 ? 's' : ''} selected
                  </p>
                  <button
                    onClick={() => setSelectedFBRCodes(new Set())}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline transition-colors duration-200"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>

            {/* HS Codes List */}
            <div className="overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ maxHeight: 'calc(92vh - 350px)' }} id="fbr-codes-container">
              {isFilteringFBR ? (
                <div className="py-16 text-center">
                  <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-emerald-600 border-t-transparent shadow-lg mb-4"></div>
                  <p className="text-slate-600 font-medium text-base">Filtering codes...</p>
                </div>
              ) : filteredFBRCodes.length === 0 ? (
                <div className="py-16 text-center">
                  <AlertCircle className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 font-medium text-base">No HS codes found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {fbrSearch ? 'Try adjusting your search terms' : 'No codes available from FBR'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-slate-600 font-medium">
                    Showing {displayedFBRCodes.length.toLocaleString()} of {filteredFBRCodes.length.toLocaleString()} codes
                  </div>
                  <div className="grid gap-3">
                    {displayedFBRCodes.map((code) => {
                      const isSelected = selectedFBRCodes.has(code.hS_CODE);
                      return (
                        <button
                          key={code.hS_CODE}
                          onClick={() => toggleFBRCodeSelection(code.hS_CODE)}
                          className={`group relative rounded-xl border-2 p-4 sm:p-5 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-500/20'
                              : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-emerald-50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <div className={`flex-shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-600'
                                : 'border-slate-300 bg-white group-hover:border-emerald-400'
                            }`}>
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <Hash className="h-5 w-5 text-white" />
                              </div>
                              <p className="font-bold text-slate-900 text-base sm:text-lg">{code.hS_CODE}</p>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{code.description}</p>
                          </div>
                        </div>

                        {/* Selected Badge */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                  </div>
                  
                  {/* Load More Button */}
                  {displayedFBRCodes.length < filteredFBRCodes.length && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={loadMoreCodes}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-3 text-sm font-semibold text-white hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2 rotate-[-90deg]" />
                        Load {Math.min(50, filteredFBRCodes.length - displayedFBRCodes.length)} More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white to-slate-50 border-t-2 border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 rounded-b-xl sm:rounded-b-2xl backdrop-blur-sm">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowFBRModal(false);
                    setSelectedFBRCodes(new Set());
                    setFbrSearch('');
                  }}
                  className="w-full sm:flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFBRCodes}
                  disabled={selectedFBRCodes.size === 0 || createHSCode.isPending}
                  className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createHSCode.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add {selectedFBRCodes.size > 0 ? `${selectedFBRCodes.size} ` : ''}Selected Code{selectedFBRCodes.size !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
