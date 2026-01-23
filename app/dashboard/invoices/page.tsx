'use client';

import { useState, useMemo } from 'react';
import UserLayout from '@/components/layouts/UserLayout';
import { useInvoices, useCreateInvoice, useDeleteInvoice } from '@/hooks/useInvoices';
import { useBuyers } from '@/hooks/useBuyers';
import { useHSCodes } from '@/hooks/useHSCodes';
import { useMyScenarios } from '@/hooks/useScenarios';
import type { CreateInvoiceRequest, InvoiceItem } from '@/types/api';
import { 
  Plus, 
  Search, 
  Trash2,
  FileText,
  Calendar,
  Building2,
  Package,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  Download,
  Printer
} from 'lucide-react';
import { InvoicePDF } from '@/components/InvoicePDF';
import { downloadInvoicePDF, printInvoicePDF } from '@/lib/pdf-utils';

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [environmentFilter, setEnvironmentFilter] = useState<'ALL' | 'TEST' | 'PRODUCTION'>('ALL');

  // Helper function to get validation status from FBR response
  const getValidationStatus = (fbrResponse: any): { status: string; message?: string } => {
    if (!fbrResponse) return { status: 'unknown' };
    
    // Check validationResponse field
    if (fbrResponse.validationResponse) {
      const status = fbrResponse.validationResponse.status?.toLowerCase();
      const error = fbrResponse.validationResponse.error;
      const invoiceStatuses = fbrResponse.validationResponse.invoiceStatuses;
      
      if (status === 'valid') {
        return { status: 'valid' };
      } else if (status === 'invalid') {
        // Get first error message if available
        const errorMsg = invoiceStatuses?.[0]?.error || error || 'Validation failed';
        return { status: 'invalid', message: errorMsg };
      }
    }
    
    // Fallback: check if there's an invoiceNumber in response (usually means success)
    if (fbrResponse.invoiceNumber || fbrResponse.InvoiceNumber) {
      return { status: 'valid' };
    }
    
    return { status: 'unknown' };
  };
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  
  // PDF generation states
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Form state for creating invoice
  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    invoiceType: 'Sale Invoice',
    invoiceDate: new Date().toISOString().split('T')[0],
    buyerId: '',
    scenarioId: '',
    invoiceRefNo: '',
    isTestEnvironment: true,
    items: [{
      hsCodeId: '',
      productDescription: '',
      rate: '17%',
      uoM: 'PCS',
      quantity: 1,
      totalValues: 0,
      valueSalesExcludingST: 0,
      fixedNotifiedValueOrRetailPrice: 0,
      salesTaxApplicable: 0,
      salesTaxWithheldAtSource: 0,
      extraTax: '',
      furtherTax: 0,
      sroScheduleNo: '',
      fedPayable: 0,
      discount: 0,
      saleType: '',
      sroItemSerialNo: '',
    }],
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      limit: 10,
    };
    if (searchTerm) params.search = searchTerm;
    if (environmentFilter !== 'ALL') params.isTestEnvironment = environmentFilter === 'TEST';
    return params;
  }, [currentPage, searchTerm, environmentFilter]);

  // React Query hooks
  const { data, isLoading } = useInvoices(queryParams);
  const { data: buyersData, refetch: refetchBuyers } = useBuyers({ limit: 100 });
  const { data: hsCodesData, refetch: refetchHSCodes } = useHSCodes({ limit: 100 });
  const { data: scenariosData, refetch: refetchScenarios } = useMyScenarios();
  const createInvoice = useCreateInvoice();
  const deleteInvoice = useDeleteInvoice();

  const invoices = data?.data || [];
  const totalInvoices = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;
  const buyers = buyersData?.data || [];
  const hsCodes = hsCodesData?.data || [];
  const scenarios = scenariosData || [];

  // Add new item to invoice
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        hsCodeId: '',
        productDescription: '',
        rate: '17%',
        uoM: 'PCS',
        quantity: 1,
        totalValues: 0,
        valueSalesExcludingST: 0,
        fixedNotifiedValueOrRetailPrice: 0,
        salesTaxApplicable: 0,
        salesTaxWithheldAtSource: 0,
        extraTax: '',
        furtherTax: 0,
        sroScheduleNo: '',
        fedPayable: 0,
        discount: 0,
        saleType: '',
        sroItemSerialNo: '',
      }],
    });
  };

  // Remove item from invoice
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  // Update item field
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  // Create invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInvoice.mutateAsync(formData);
    setShowCreateModal(false);
    resetForm();
  };

  // Delete invoice
  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;
    await deleteInvoice.mutateAsync(selectedInvoice.id);
    setShowDeleteModal(false);
    setSelectedInvoice(null);
  };

  // Download invoice as PDF
  const handleDownloadPDF = async () => {
    if (!selectedInvoice) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdfComponent = <InvoicePDF invoice={selectedInvoice} />;
      const fileName = `Invoice_${selectedInvoice.fbrInvoiceNumber || selectedInvoice.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await downloadInvoicePDF(pdfComponent, fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Print invoice
  const handlePrintInvoice = async () => {
    if (!selectedInvoice) return;
    
    setIsPrinting(true);
    try {
      const pdfComponent = <InvoicePDF invoice={selectedInvoice} />;
      
      await printInvoicePDF(pdfComponent);
    } catch (error) {
      console.error('Error printing PDF:', error);
      alert('Failed to print invoice. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      invoiceType: 'Sale Invoice',
      invoiceDate: new Date().toISOString().split('T')[0],
      buyerId: '',
      scenarioId: '',
      invoiceRefNo: '',
      isTestEnvironment: true,
      items: [{
        hsCodeId: '',
        productDescription: '',
        rate: '17%',
        uoM: 'PCS',
        quantity: 1,
        totalValues: 0,
        valueSalesExcludingST: 0,
        fixedNotifiedValueOrRetailPrice: 0,
        salesTaxApplicable: 0,
        salesTaxWithheldAtSource: 0,
        extraTax: '',
        furtherTax: 0,
        sroScheduleNo: '',
        fedPayable: 0,
        discount: 0,
        saleType: '',
        sroItemSerialNo: '',
      }],
    });
  };

  // Open details modal
  const openDetailsModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  // Open delete modal
  const openDeleteModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  return (
    <UserLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Invoices Management</h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 flex items-center">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Manage your FBR invoices
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(true);
              // Refetch data when modal opens to ensure latest data
              refetchBuyers();
              refetchHSCodes();
              refetchScenarios();
            }}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Create Invoice
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by invoice number or reference..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Environment Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                <Filter className="inline h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
                Environment
              </label>
              <select
                value={environmentFilter}
                onChange={(e) => {
                  setEnvironmentFilter(e.target.value as 'ALL' | 'TEST' | 'PRODUCTION');
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="ALL">All Environments</option>
                <option value="TEST">Test/Sandbox</option>
                <option value="PRODUCTION">Production</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between border-t-2 border-slate-200 pt-4 sm:pt-5">
            <p className="text-xs sm:text-sm text-slate-600 flex items-center">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Showing <span className="font-bold text-slate-900 mx-1">{invoices.length}</span> of{' '}
              <span className="font-bold text-slate-900 ml-1">{totalInvoices}</span> invoices
            </p>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
              <p className="text-slate-600 font-medium text-sm sm:text-base">No invoices found</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Create your first invoice to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Invoice Number
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                      Buyer
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden sm:table-cell">
                      Environment
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoices.map((invoice: any) => (
                    <tr key={invoice.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="font-bold text-slate-900 text-sm sm:text-base">{invoice.fbrInvoiceNumber || 'N/A'}</p>
                            {invoice.invoiceRefNo && (
                              <p className="text-xs text-slate-600">Ref: {invoice.invoiceRefNo}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <p className="text-sm text-slate-700 flex items-center">
                          <Building2 className="h-4 w-4 mr-1.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{invoice.buyer?.businessName || 'N/A'}</span>
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        {invoice.isTestEnvironment ? (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Test
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Production
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        {(() => {
                          const validation = getValidationStatus(invoice.fbrResponse);
                          if (validation.status === 'valid') {
                            return (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800" title="Invoice validated successfully">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Valid
                              </span>
                            );
                          } else if (validation.status === 'invalid') {
                            return (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800" title={validation.message}>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Invalid
                              </span>
                            );
                          } else {
                            return (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Unknown
                              </span>
                            );
                          }
                        })()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => openDetailsModal(invoice)}
                            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:scale-110 transition-transform duration-200" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(invoice)}
                            className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="Delete invoice"
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

      {/* Create Invoice Modal - This will be lengthy, so I'll create it in the next part */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200 my-8">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700 z-10">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Create New Invoice</h3>
              </div>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Basic Invoice Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 flex items-center border-b-2 border-slate-200 pb-2">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Invoice Details
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Invoice Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.invoiceType}
                      onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g., Sale Invoice"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Invoice Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.invoiceDate}
                      onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Buyer <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.buyerId}
                      onChange={(e) => setFormData({ ...formData, buyerId: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Buyer</option>
                      {buyers.map((buyer) => (
                        <option key={buyer.id} value={buyer.id}>
                          {buyer.businessName} - {buyer.ntncnic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Scenario <span className="text-red-500">*</span>
                      <span className="text-xs font-normal text-purple-600 ml-2">(Provides saleType)</span>
                    </label>
                    <select
                      required
                      value={formData.scenarioId}
                      onChange={(e) => setFormData({ ...formData, scenarioId: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Scenario</option>
                      {scenarios.map((scenario: any) => (
                        <option key={scenario.scenarioId} value={scenario.scenarioId}>
                          {scenario.scenarioCode} - {scenario.scenarioDescription}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-slate-500">
                      Scenario description will be used as saleType for all invoice items
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Reference Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.invoiceRefNo}
                      onChange={(e) => setFormData({ ...formData, invoiceRefNo: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="INV-2026-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Environment <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.isTestEnvironment ? 'test' : 'production'}
                      onChange={(e) => setFormData({ ...formData, isTestEnvironment: e.target.value === 'test' })}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="test">Test/Sandbox</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Invoice Items
                  </h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-all duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="border-2 border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-slate-900">Item {index + 1}</h5>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          HS Code <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={item.hsCodeId}
                          onChange={(e) => updateItem(index, 'hsCodeId', e.target.value)}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="">Select HS Code</option>
                          {hsCodes.map((hsCode) => (
                            <option key={hsCode.id} value={hsCode.id}>
                              {hsCode.hsCode}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Product Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={item.productDescription}
                          onChange={(e) => updateItem(index, 'productDescription', e.target.value)}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Rate <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', e.target.value)}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="17%"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          UoM <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={item.uoM}
                          onChange={(e) => updateItem(index, 'uoM', e.target.value)}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          placeholder="PCS"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Total Value <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={item.totalValues}
                          onChange={(e) => updateItem(index, 'totalValues', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Value Excl. ST <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={item.valueSalesExcludingST}
                          onChange={(e) => updateItem(index, 'valueSalesExcludingST', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Retail Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={item.fixedNotifiedValueOrRetailPrice}
                          onChange={(e) => updateItem(index, 'fixedNotifiedValueOrRetailPrice', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Sales Tax <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={item.salesTaxApplicable}
                          onChange={(e) => updateItem(index, 'salesTaxApplicable', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tax Withheld
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.salesTaxWithheldAtSource}
                          onChange={(e) => updateItem(index, 'salesTaxWithheldAtSource', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Further Tax
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.furtherTax}
                          onChange={(e) => updateItem(index, 'furtherTax', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          FED Payable
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.fedPayable}
                          onChange={(e) => updateItem(index, 'fedPayable', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Discount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value))}
                          className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-6 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createInvoice.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200 my-8">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700 z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-lg sm:text-2xl font-bold text-white flex items-center">
                  <FileText className="h-6 w-6 sm:h-7 sm:w-7 mr-2" />
                  Invoice Details
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* PDF Action Buttons */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="inline-flex items-center rounded-lg bg-white/10 hover:bg-white/20 border-2 border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={handlePrintInvoice}
                    disabled={isPrinting}
                    className="inline-flex items-center rounded-lg bg-white/10 hover:bg-white/20 border-2 border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" />
                    {isPrinting ? 'Printing...' : 'Print'}
                  </button>
                  
                  {/* Environment Badge */}
                  {selectedInvoice.isTestEnvironment ? (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-300">
                      <AlertCircle className="h-3 w-3 mr-1.5" />
                      Test Mode
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-300">
                      <CheckCircle className="h-3 w-3 mr-1.5" />
                      Production
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Invoice Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5">
                <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Invoice Information
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">FBR Invoice Number</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.fbrInvoiceNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Invoice Reference</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.invoiceRefNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Invoice Type</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.invoiceType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Invoice Date</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Scenario</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.scenario?.scenarioCode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Created At</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 sm:p-5">
                <h4 className="text-sm font-bold text-emerald-900 mb-4 flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-emerald-600" />
                  Buyer Information
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Business Name</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.buyer?.businessName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">NTN/CNIC</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.buyer?.ntncnic || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Province</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.buyer?.province || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Registration Type</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.buyer?.registrationType || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Address</label>
                    <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.buyer?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="border-2 border-slate-200 rounded-xl p-4 sm:p-5">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-slate-600" />
                  Invoice Items ({selectedInvoice.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item: any, index: number) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 transition-colors duration-200">
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Product</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{item.productDescription}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">HS Code</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{item.hsCode?.hsCode || item.hsCode || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Rate</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{item.rate}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Quantity</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{item.quantity} {item.uoM}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Total Value</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.totalValues).toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Value (Excl. ST)</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.valueSalesExcludingST).toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Retail Price</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.fixedNotifiedValueOrRetailPrice).toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Sales Tax</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.salesTaxApplicable).toFixed(2)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600">Tax Withheld</label>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.salesTaxWithheldAtSource || 0).toFixed(2)}</p>
                          </div>
                          {item.furtherTax > 0 && (
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Further Tax</label>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.furtherTax).toFixed(2)}</p>
                            </div>
                          )}
                          {item.discount > 0 && (
                            <div>
                              <label className="text-xs font-semibold text-slate-600">Discount</label>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.discount).toFixed(2)}</p>
                            </div>
                          )}
                          {item.fedPayable > 0 && (
                            <div>
                              <label className="text-xs font-semibold text-slate-600">FED Payable</label>
                              <p className="text-sm font-bold text-slate-900 mt-0.5">Rs. {parseFloat(item.fedPayable).toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                        {item.sroScheduleNo && (
                          <div className="mt-2 pt-2 border-t border-slate-200">
                            <p className="text-xs text-slate-600"><span className="font-semibold">SRO Schedule:</span> {item.sroScheduleNo}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 text-center py-4">No items in this invoice</p>
                  )}
                </div>
              </div>

              {/* FBR Response Section */}
              {selectedInvoice.fbrResponse && Object.keys(selectedInvoice.fbrResponse).length > 0 && (
                <div>
                  {/* Validation Status Banner */}
                  {(() => {
                    const validation = getValidationStatus(selectedInvoice.fbrResponse);
                    if (validation.status === 'valid') {
                      return (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-5 mb-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-green-900 mb-1">Invoice Validated Successfully</h4>
                              <p className="text-sm text-green-700">This invoice has been validated and accepted by FBR.</p>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (validation.status === 'invalid') {
                      return (
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 sm:p-5 mb-4">
                          <div className="flex items-start">
                            <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5\" />
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-red-900 mb-1">Invoice Validation Failed</h4>
                              <p className="text-sm text-red-700 mb-2">This invoice was rejected by FBR due to validation errors.</p>
                              {validation.message && (
                                <div className="bg-white border border-red-200 rounded-lg p-3 mt-2">
                                  <p className="text-xs font-semibold text-red-800 mb-1">Error Details:</p>
                                  <p className="text-xs text-red-700">{validation.message}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Full FBR Response */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 sm:p-5">
                    <h4 className="text-sm font-bold text-purple-900 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                      Full FBR Response
                    </h4>
                    <div className="bg-white rounded-lg p-3 border border-purple-100 text-xs font-mono text-slate-700 overflow-x-auto max-h-48 overflow-y-auto">
                      <pre>{JSON.stringify(selectedInvoice.fbrResponse, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-3 font-semibold text-white hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl sm:rounded-t-2xl border-b-2 border-red-800">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Delete Invoice</h3>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-slate-700 mb-4">
                Are you sure you want to delete invoice <span className="font-bold text-slate-900">{selectedInvoice.fbrInvoiceNumber || 'N/A'}</span>?
              </p>
              <p className="text-xs sm:text-sm text-red-600 mb-4">
                This action cannot be undone. The invoice will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInvoice}
                  disabled={deleteInvoice.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteInvoice.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
