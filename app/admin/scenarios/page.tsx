'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();
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
          <h1 className={`text-3xl font-bold flex items-center gap-3 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-stone-900'
          }`}>
            <Layers className="w-8 h-8 text-emerald-400" />
            Global Scenarios
          </h1>
          <p className={`mt-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-stone-200/85' : 'text-stone-700'
          }`}>
            Manage the global catalog of scenarios. Assign scenarios to users to
            enable them for invoice creation.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Scenario
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
          theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
        }`} />
        <input
          type="text"
          placeholder="Search scenarios by code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/20 text-white placeholder-stone-400' 
              : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
          }`}
        />
      </div>

      {/* Scenarios List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className={`mt-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
          }`}>Loading scenarios...</p>
        </div>
      ) : filteredScenarios && filteredScenarios.length > 0 ? (
        <div className="grid gap-4">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`backdrop-blur-xl border rounded-lg p-5 hover:shadow-lg hover:border-emerald-400/30 transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 hover:shadow-emerald-900/20' 
                  : 'bg-white border-stone-200 hover:shadow-stone-900/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-stone-900'
                    }`}>
                      {scenario.scenarioCode}
                    </h3>
                  </div>
                  <p className={`ml-8 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-stone-200/85' : 'text-stone-700'
                  }`}>
                    {scenario.scenarioDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 ml-8 mt-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    }`}>
                      {scenario.salesType || '—'}
                    </span>
                    {scenario.fbrId && (
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-colors duration-300 ${
                        theme === 'dark'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                      }`}>
                        FBR ID: {scenario.fbrId}
                      </span>
                    )}
                    <span className={`text-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      Created: {new Date(scenario.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(scenario)}
                    className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all border border-transparent hover:border-cyan-500/30"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(scenario.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30"
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
        <div className={`text-center py-12 backdrop-blur-xl rounded-lg border transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white border-stone-200'
        }`}>
          <Layers className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
            theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
          }`} />
          <p className={`text-lg transition-colors duration-300 ${
            theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
          }`}>
            {searchTerm ? 'No scenarios found' : 'No scenarios yet'}
          </p>
          <p className={`mt-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
          }`}>
            {searchTerm
              ? 'Try adjusting your search'
              : 'Create your first global scenario'}
          </p>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-black/70' : 'bg-black/40'
        }`}>
          <div className={`backdrop-blur-xl border rounded-lg max-w-md w-full p-6 shadow-2xl transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-slate-900/95 border-white/10' 
              : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Create Global Scenario
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className={`transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  Scenario Code *
                </label>
                <input
                  type="text"
                  value={formData.scenarioCode}
                  onChange={(e) =>
                    setFormData({ ...formData, scenarioCode: e.target.value })
                  }
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400' 
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., SN001"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
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
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., Goods at standard rate to registered buyers"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  Sales Type *
                </label>
                <input
                  type="text"
                  value={formData.salesType}
                  onChange={(e) =>
                    setFormData({ ...formData, salesType: e.target.value })
                  }
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., Goods at Standard Rate (default)"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  FBR ID
                </label>
                <input
                  type="number"
                  value={formData.fbrId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fbrId: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-900/30"
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
        <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-black/70' : 'bg-black/40'
        }`}>
          <div className={`backdrop-blur-xl border rounded-lg max-w-md w-full p-6 shadow-2xl transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-white/10'
              : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-stone-900'
              }`}>
                Edit Global Scenario
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className={`transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  Scenario Code *
                </label>
                <input
                  type="text"
                  value={formData.scenarioCode}
                  onChange={(e) =>
                    setFormData({ ...formData, scenarioCode: e.target.value })
                  }
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., SN001"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
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
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., Goods at standard rate to registered buyers"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  Sales Type *
                </label>
                <input
                  type="text"
                  value={formData.salesType}
                  onChange={(e) =>
                    setFormData({ ...formData, salesType: e.target.value })
                  }
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., Goods at Standard Rate (default)"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  FBR ID
                </label>
                <input
                  type="number"
                  value={formData.fbrId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, fbrId: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className={`w-full px-3 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/20 text-white placeholder-stone-400'
                      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                  }`}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={`flex-1 px-4 py-2 border-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-900/30"
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
