"use client";

import { useState } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import { Search, Plus, X, Edit, Trash2, Loader2, Layers, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useScenarios,
  useCreateScenario,
  useUpdateScenario,
  useDeleteScenario,
} from "@/hooks/useScenarios";
import { Scenario } from "@/types/api";

export default function ScenariosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  // Fetch scenarios with React Query
  const { data, isLoading, error } = useScenarios({
    page: currentPage,
    limit: 10,
    search: searchQuery,
  });

  const scenarios = data?.data || [];
  const pagination = data?.pagination;

  // Mutations
  const createMutation = useCreateScenario();
  const updateMutation = useUpdateScenario();
  const deleteMutation = useDeleteScenario();

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle create
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const scenarioCode = formData.get("scenarioCode") as string;
    const scenarioDescription = formData.get("scenarioDescription") as string;

    createMutation.mutate(
      { scenarioCode, scenarioDescription },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          e.currentTarget.reset();
        },
      }
    );
  };

  // Handle edit
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedScenario) return;

    const formData = new FormData(e.currentTarget);
    const scenarioCode = formData.get("scenarioCode") as string;
    const scenarioDescription = formData.get("scenarioDescription") as string;

    updateMutation.mutate(
      {
        id: selectedScenario.id,
        data: { scenarioCode, scenarioDescription },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedScenario(null);
        },
      }
    );
  };

  // Handle delete
  const handleDelete = () => {
    if (!selectedScenario) return;

    deleteMutation.mutate(selectedScenario.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedScenario(null);
      },
    });
  };

  return (
    <UserLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Scenarios</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 flex items-center">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-purple-600" />
            Scenario descriptions are used as <span className="font-semibold text-purple-600 ml-1">saleType</span> in FBR invoices
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add Scenario
        </button>
      </div>

      {/* Search and Stats Card */}
      <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg border border-slate-200 p-4 sm:p-6">
        <div className="relative mb-4 sm:mb-5">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search scenarios by code or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t-2 border-slate-200 pt-4 sm:pt-5">
          <p className="text-xs sm:text-sm text-slate-600 flex items-center">
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
            Showing <span className="font-bold text-slate-900 mx-1">{scenarios.length}</span> of{' '}
            <span className="font-bold text-slate-900 ml-1">{pagination?.total || 0}</span> scenarios
          </p>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium">Loading scenarios...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-red-300 mb-3 sm:mb-4" />
            <p className="text-red-600 font-medium text-sm sm:text-base">Error loading scenarios</p>
            <p className="text-xs sm:text-sm text-red-500 mt-1">Please try again</p>
          </div>
        ) : scenarios.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
            <p className="text-slate-600 font-medium text-sm sm:text-base">No scenarios found</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Create your first scenario to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Scenario Code
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {scenarios.map((scenario) => (
                  <tr key={scenario.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                          <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-slate-900 text-base sm:text-lg">{scenario.scenarioCode}</p>
                          <p className="text-xs sm:text-sm text-slate-600 md:hidden truncate max-w-[200px]">{scenario.scenarioDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <p className="text-sm sm:text-base text-slate-700 flex items-center">
                        <FileText className="h-4 w-4 mr-1.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{scenario.scenarioDescription}</span>
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                      <p className="text-sm sm:text-base text-slate-600">
                        {new Date(scenario.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => {
                            setSelectedScenario(scenario);
                            setIsEditModalOpen(true);
                          }}
                          className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                          title="Edit scenario"
                        >
                          <Edit className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedScenario(scenario);
                            setIsDeleteModalOpen(true);
                          }}
                          className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                          title="Delete scenario"
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
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-xl sm:rounded-b-2xl">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
            Previous
          </button>
          <span className="text-xs sm:text-sm font-semibold text-slate-700 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-slate-200 shadow-sm">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage === pagination.totalPages}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Add New Scenario</h3>
              </div>
            </div>
            <form onSubmit={handleCreate} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Scenario Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="scenarioCode"
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="e.g., SN001"
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Unique code to identify this scenario
                </p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="scenarioDescription"
                  required
                  minLength={5}
                  maxLength={500}
                  rows={3}
                  placeholder="e.g., Standard retail sale with 17% tax"
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Describe the tax configuration and use case
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Scenario"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Edit Scenario</h3>
              </div>
            </div>
            <form onSubmit={handleEdit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Scenario Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="scenarioCode"
                  required
                  minLength={2}
                  maxLength={50}
                  defaultValue={selectedScenario.scenarioCode}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="scenarioDescription"
                  required
                  minLength={5}
                  maxLength={500}
                  rows={3}
                  defaultValue={selectedScenario.scenarioDescription}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedScenario(null);
                  }}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Scenario"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl sm:rounded-t-2xl border-b-2 border-red-800">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Delete Scenario</h3>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-slate-700 mb-4">
                Are you sure you want to delete this scenario?
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-200 mb-4">
                <p className="text-sm font-semibold text-slate-900">
                  {selectedScenario.scenarioCode}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedScenario.scenarioDescription}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-red-600 mb-4">
                Note: This scenario can only be deleted if it&apos;s not used in any
                invoices. This action cannot be undone.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedScenario(null);
                  }}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Scenario"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </UserLayout>
  );
}
