'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { useUsers } from '@/hooks/useUsers';
import {
  useGlobalScenarios,
  useUserScenarioAssignments,
  useBulkAssignScenarios,
  useUnassignScenario,
} from '@/hooks/useAdminScenarios';
import { User, GlobalScenario } from '@/types/api';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';

export default function AdminScenarioAssignmentsPage() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  const { data: usersResponse, isLoading: usersLoading } = useUsers();
  const { data: globalScenarios, isLoading: scenariosLoading } =
    useGlobalScenarios();
  const { data: userAssignments } = useUserScenarioAssignments(
    selectedUser?.id || ''
  );
  const bulkAssignMutation = useBulkAssignScenarios();
  const unassignMutation = useUnassignScenario();

  const users = usersResponse?.data?.users || [];
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignedScenarioIds =
    userAssignments?.map((assignment) => assignment.scenarioId) || [];

  const globalScenariosList = globalScenarios?.data || [];

  const availableScenarios =
    globalScenariosList.filter(
      (scenario: GlobalScenario) => !assignedScenarioIds.includes(scenario.id)
    ) || [];

  const assignedScenarios =
    globalScenariosList.filter((scenario: GlobalScenario) =>
      assignedScenarioIds.includes(scenario.id)
    ) || [];

  const handleBulkAssign = async () => {
    if (!selectedUser || selectedScenarios.length === 0) return;

    await bulkAssignMutation.mutateAsync({
      userId: selectedUser.id,
      scenarioIds: selectedScenarios,
    });

    setSelectedScenarios([]);
  };

  const handleUnassign = async (scenarioId: string) => {
    if (!selectedUser) return;

    if (
      confirm(
        'Are you sure you want to unassign this scenario? This will fail if the scenario is used in any invoices.'
      )
    ) {
      await unassignMutation.mutateAsync({
        userId: selectedUser.id,
        scenarioId,
      });
    }
  };

  const toggleScenarioSelection = (scenarioId: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(scenarioId)
        ? prev.filter((id) => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className={`text-2xl font-bold flex items-center gap-3 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-stone-900'
          }`}>
            <Layers className="w-5 h-5 text-emerald-400" />
            Scenario Assignments
          </h2>
          <p className={`text-sm mt-1 transition-colors duration-300 ${
            theme === 'dark' ? 'text-stone-200/85' : 'text-stone-700'
          }`}>
            Assign global scenarios to users. Users can only create invoices using
            their assigned scenarios.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Users List */}
          <div className="space-y-4">
          <div>
            <h2 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-stone-900'
            }`}>
              Select User
            </h2>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 backdrop-blur-sm border-2 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/20 text-white placeholder-stone-400' 
                    : 'bg-white border-stone-300 text-stone-900 placeholder-stone-500'
                }`}
              />
            </div>
          </div>

          <div className={`backdrop-blur-xl border rounded-lg max-h-[600px] overflow-y-auto transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10' 
              : 'bg-white border-stone-200'
          }`}>
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedScenarios([]);
                  }}
                  className={`w-full text-left p-4 border-b hover:bg-white/5 transition-all ${
                    selectedUser?.id === user.id ? 'bg-emerald-500/10 border-l-4 border-l-emerald-400' : ''
                  } ${
                    theme === 'dark' 
                      ? 'border-white/10' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-stone-900'
                      }`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm transition-colors duration-300 ${
                        theme === 'dark' ? 'text-stone-300/85' : 'text-stone-600'
                      }`}>{user.email}</p>
                      <p className={`text-sm transition-colors duration-300 ${
                        theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
                      }`}>
                        {user.businessName}
                      </p>
                    </div>
                    {user.isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className={`w-12 h-12 mx-auto mb-2 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
                }`} />
                <p className={`transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                }`}>No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Scenario Assignment */}
        <div className="space-y-4">
          {selectedUser ? (
            <>
              <div className={`border backdrop-blur-sm rounded-lg p-4 transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-emerald-50 border-emerald-300'
              }`}>
                <h2 className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>
                  {selectedUser.name}
                </h2>
                <p className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                }`}>{selectedUser.email}</p>
                <p className={`text-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                }`}>
                  {selectedUser.businessName}
                </p>
              </div>

              {/* Assigned Scenarios */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-stone-900'
                }`}>
                  Assigned Scenarios ({assignedScenarios.length})
                </h3>
                <div className={`backdrop-blur-xl border rounded-lg max-h-[200px] overflow-y-auto transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-stone-200'
                }`}>
                  {assignedScenarios.length > 0 ? (
                    assignedScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className={`flex items-center justify-between p-3 border-b last:border-0 transition-colors duration-300 ${
                          theme === 'dark' ? 'border-white/10' : 'border-stone-200'
                        }`}
                      >
                        <div className="flex-1">
                          <p className={`font-medium transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-stone-900'
                          }`}>
                            {scenario.scenarioCode}
                          </p>
                          <p className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-stone-300/85' : 'text-stone-600'
                          }`}>
                            {scenario.scenarioDescription}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnassign(scenario.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                          title="Unassign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className={`transition-colors duration-300 ${
                        theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                      }`}>No scenarios assigned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Scenarios */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-stone-900'
                  }`}>
                    Available Scenarios ({availableScenarios.length})
                  </h3>
                  {selectedScenarios.length > 0 && (
                    <button
                      onClick={handleBulkAssign}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Assign ({selectedScenarios.length})
                    </button>
                  )}
                </div>
                <div className={`backdrop-blur-xl border rounded-lg max-h-[300px] overflow-y-auto transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-stone-200'
                }`}>
                  {scenariosLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                    </div>
                  ) : availableScenarios.length > 0 ? (
                    availableScenarios.map((scenario) => (
                      <label
                        key={scenario.id}
                        className={`flex items-start gap-3 p-3 border-b last:border-0 hover:bg-white/5 cursor-pointer transition-colors duration-300 ${
                          theme === 'dark' 
                            ? 'border-white/10' 
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario.id)}
                          onChange={() => toggleScenarioSelection(scenario.id)}
                          className={`mt-1 w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 transition-colors duration-300 ${
                            theme === 'dark'
                              ? 'bg-white/5 border-white/20'
                              : 'bg-white border-stone-300'
                          }`}
                        />
                        <div className="flex-1">
                          <p className={`font-medium transition-colors duration-300 ${
                            theme === 'dark' ? 'text-white' : 'text-stone-900'
                          }`}>
                            {scenario.scenarioCode}
                          </p>
                          <p className={`text-sm transition-colors duration-300 ${
                            theme === 'dark' ? 'text-stone-300/85' : 'text-stone-600'
                          }`}>
                            {scenario.scenarioDescription}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Layers className={`w-12 h-12 mx-auto mb-2 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
                      }`} />
                      <p className={`transition-colors duration-300 ${
                        theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
                      }`}>All scenarios assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={`backdrop-blur-xl border rounded-lg p-12 text-center transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-white border-stone-200'
            }`}>
              <Users className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
              }`} />
              <p className={`text-lg transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-200' : 'text-stone-700'
              }`}>Select a user to manage</p>
              <p className={`mt-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
              }`}>
                Choose a user from the left to view and assign scenarios
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </AdminLayout>
  );
}
