'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  useGlobalScenarios,
  useCreateGlobalScenario,
  useUpdateGlobalScenario,
  useDeleteGlobalScenario,
} from '@/hooks/useAdminScenarios';
import { GlobalScenario } from '@/types/api';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Layers,
  X,
  FileText,
  Loader2,
} from 'lucide-react';

export default function AdminScenariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<GlobalScenario | null>(
    null
  );
  const [formData, setFormData] = useState({
    scenarioCode: '',
    scenarioDescription: '',
  });

  const { data: scenarios, isLoading } = useGlobalScenarios();
  const createMutation = useCreateGlobalScenario();
  const updateMutation = useUpdateGlobalScenario();
  const deleteMutation = useDeleteGlobalScenario();

  const scenarioList = scenarios?.data || [];
  const filteredScenarios = scenarioList.filter(
    (scenario: GlobalScenario) =>
      scenario.scenarioCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.scenarioDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ scenarioCode: '', scenarioDescription: '' });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (scenario: GlobalScenario) => {
    setSelectedScenario(scenario);
    setFormData({
      scenarioCode: scenario.scenarioCode,
      scenarioDescription: scenario.scenarioDescription,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        'Are you sure you want to delete this scenario? This will fail if the scenario is assigned to any user.'
      )
    ) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync(formData);
    setIsCreateModalOpen(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScenario) return;
    await updateMutation.mutateAsync({
      id: selectedScenario.id,
      data: formData,
    });
    setIsEditModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Global Scenarios</h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 flex items-center">
              <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Manage the global catalog of scenarios for invoice creation
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Create Scenario
          </button>
        </div>

        {/* Search and Stats Card */}
        <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by scenario code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between border-t-2 border-slate-200 pt-4 sm:pt-5">
            <p className="text-xs sm:text-sm text-slate-600 flex items-center">
              <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Total <span className="font-bold text-slate-900 ml-1">{filteredScenarios?.length || 0}</span> scenarios
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
          ) : filteredScenarios && filteredScenarios.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {filteredScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                          {scenario.scenarioCode}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 ml-7 mb-2">
                        {scenario.scenarioDescription}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 ml-7">
                        Created: {new Date(scenario.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(scenario)}
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                        title="Edit scenario"
                      >
                        <Edit className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(scenario.id)}
                        className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                        title="Delete scenario"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 sm:py-16 text-center">
              <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
              <p className="text-slate-600 font-medium text-sm sm:text-base">
                {searchTerm ? 'No scenarios found' : 'No scenarios yet'}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Create your first global scenario'}
              </p>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Create Global Scenario</h3>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmitCreate} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Scenario Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.scenarioCode}
                    onChange={(e) =>
                      setFormData({ ...formData, scenarioCode: e.target.value })
                    }
                    className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g., SN001"
                    required
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
                    value={formData.scenarioDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scenarioDescription: e.target.value,
                      })
                    }
                    className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g., Goods at standard rate to registered buyers"
                    rows={3}
                    required
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
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Edit Global Scenario</h3>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmitEdit} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Scenario Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.scenarioCode}
                    onChange={(e) =>
                      setFormData({ ...formData, scenarioCode: e.target.value })
                    }
                    className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g., SN001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.scenarioDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scenarioDescription: e.target.value,
                      })
                    }
                    className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g., Goods at standard rate to registered buyers"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
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
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
