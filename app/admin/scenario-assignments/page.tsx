'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
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
  Shield,
  Loader2,
} from 'lucide-react';

export default function AdminScenarioAssignmentsPage() {
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

  const globalScenarioList = globalScenarios?.data || [];

  const availableScenarios = globalScenarioList.filter(
    (scenario: GlobalScenario) => !assignedScenarioIds.includes(scenario.id)
  );

  const assignedScenarios = globalScenarioList.filter((scenario: GlobalScenario) =>
    assignedScenarioIds.includes(scenario.id)
  );

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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Scenario Assignments</h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 flex items-center">
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
            Assign global scenarios to users for invoice creation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Panel - Users List */}
          <div className="space-y-3 sm:space-y-4">
            <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Select User
              </h2>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg border border-slate-200 max-h-[600px] overflow-y-auto">
              {usersLoading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 font-medium">Loading users...</p>
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSelectedScenarios([]);
                      }}
                      className={`w-full text-left p-3 sm:p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 ${
                        selectedUser?.id === user.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                            {user.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 truncate">{user.email}</p>
                          <p className="text-xs sm:text-sm text-slate-500 truncate">
                            {user.businessName}
                          </p>
                        </div>
                        {user.isActive ? (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
                  <p className="text-slate-600 text-sm sm:text-base font-medium">No users found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Scenario Assignment */}
          <div className="space-y-3 sm:space-y-4">
            {selectedUser ? (
              <>
                <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-4 sm:p-5 shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                        {selectedUser.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 ml-13">{selectedUser.email}</p>
                  <p className="text-xs sm:text-sm text-slate-600 ml-13">
                    {selectedUser.businessName}
                  </p>
                </div>

                {/* Assigned Scenarios */}
                <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center justify-between">
                    <span className="flex items-center">
                      <Layers className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-emerald-600" />
                      Assigned Scenarios ({assignedScenarios.length})
                    </span>
                  </h3>
                  <div className="border-2 border-slate-200 rounded-lg max-h-[200px] overflow-y-auto">
                    {assignedScenarios.length > 0 ? (
                      <div className="divide-y divide-slate-200">
                        {assignedScenarios.map((scenario) => (
                          <div
                            key={scenario.id}
                            className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm sm:text-base truncate">
                                {scenario.scenarioCode}
                              </p>
                              <p className="text-xs sm:text-sm text-slate-600 truncate">
                                {scenario.scenarioDescription}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnassign(scenario.id)}
                              className="ml-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-2 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg group flex-shrink-0"
                              title="Unassign"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform duration-200" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-600 text-sm">No scenarios assigned</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Scenarios */}
                <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center">
                      <Layers className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                      Available Scenarios ({availableScenarios.length})
                    </h3>
                    {selectedScenarios.length > 0 && (
                      <button
                        onClick={handleBulkAssign}
                        disabled={bulkAssignMutation.isPending}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bulkAssignMutation.isPending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Assign ({selectedScenarios.length})
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="border-2 border-slate-200 rounded-lg max-h-[300px] overflow-y-auto">
                    {scenariosLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600">Loading...</p>
                      </div>
                    ) : availableScenarios.length > 0 ? (
                      <div className="divide-y divide-slate-200">
                        {availableScenarios.map((scenario) => (
                          <label
                            key={scenario.id}
                            className="flex items-start gap-2 sm:gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedScenarios.includes(scenario.id)}
                              onChange={() => toggleScenarioSelection(scenario.id)}
                              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 text-sm sm:text-base truncate">
                                {scenario.scenarioCode}
                              </p>
                              <p className="text-xs sm:text-sm text-slate-600 truncate">
                                {scenario.scenarioDescription}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Layers className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-600 text-sm">All scenarios assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 p-8 sm:p-12 text-center shadow-lg">
                <Users className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-600 text-base sm:text-lg font-medium">Select a user to manage</p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2">
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
