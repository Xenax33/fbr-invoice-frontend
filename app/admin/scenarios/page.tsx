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
  Pencil,
  Trash2,
  Search,
  Layers,
  X,
  FileText,
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
    salesType: '',
    fbrId: undefined as number | undefined,
  });

  const { data: scenariosResponse, isLoading } = useGlobalScenarios();
  const createMutation = useCreateGlobalScenario();
  const updateMutation = useUpdateGlobalScenario();
  const deleteMutation = useDeleteGlobalScenario();

  const scenarios = scenariosResponse?.data || [];
  const filteredScenarios = scenarios.filter(
    (scenario) =>
      scenario.scenarioCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.scenarioDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setFormData({ scenarioCode: '', scenarioDescription: '', salesType: '', fbrId: undefined });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (scenario: GlobalScenario) => {
    setSelectedScenario(scenario);
    setFormData({
      scenarioCode: scenario.scenarioCode,
      scenarioDescription: scenario.scenarioDescription,
      salesType: scenario.salesType || '',
      fbrId: scenario.fbrId,
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
      <div className="space-y-6">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="w-8 h-8 text-indigo-600" />
            Global Scenarios
          </h1>
          <p className="text-gray-600 mt-2">
            Manage the global catalog of scenarios. Assign scenarios to users to
            enable them for invoice creation.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Scenario
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search scenarios by code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Scenarios List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading scenarios...</p>
        </div>
      ) : filteredScenarios && filteredScenarios.length > 0 ? (
        <div className="grid gap-4">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scenario.scenarioCode}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-8">
                    {scenario.scenarioDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 ml-8 mt-3">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                      {scenario.salesType || '—'}
                    </span>
                    {scenario.fbrId && (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100">
                        FBR ID: {scenario.fbrId}
                      </span>
                    )}
                    <span className="text-sm text-gray-400">
                      Created: {new Date(scenario.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(scenario)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(scenario.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No scenarios found' : 'No scenarios yet'}
          </p>
          <p className="text-gray-400 mt-2">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Create your first global scenario'}
          </p>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Create Global Scenario
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Code *
                </label>
                <input
                  type="text"
                  value={formData.scenarioCode}
                  onChange={(e) =>
                    setFormData({ ...formData, scenarioCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., SN001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.scenarioDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scenarioDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Goods at standard rate to registered buyers"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Type *
                </label>
                <input
                  type="text"
                  value={formData.salesType}
                  onChange={(e) =>
                    setFormData({ ...formData, salesType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Goods at Standard Rate (default)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  FBR ID
                </label>
                <input
                  type="number"
                  value={formData.fbrId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fbrId: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Global Scenario
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Code *
                </label>
                <input
                  type="text"
                  value={formData.scenarioCode}
                  onChange={(e) =>
                    setFormData({ ...formData, scenarioCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., SN001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.scenarioDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scenarioDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Goods at standard rate to registered buyers"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Type *
                </label>
                <input
                  type="text"
                  value={formData.salesType}
                  onChange={(e) =>
                    setFormData({ ...formData, salesType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Goods at Standard Rate (default)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  FBR ID
                </label>
                <input
                  type="number"
                  value={formData.fbrId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fbrId: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
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
