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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="w-5 h-5 text-indigo-600" />
            Scenario Assignments
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Assign global scenarios to users. Users can only create invoices using
            their assigned scenarios.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Users List */}
          <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Select User
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg max-h-[600px] overflow-y-auto">
            {usersLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setSelectedScenarios([]);
                  }}
                  className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    selectedUser?.id === user.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        {user.businessName}
                      </p>
                    </div>
                    {user.isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Scenario Assignment */}
        <div className="space-y-4">
          {selectedUser ? (
            <>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-600">
                  {selectedUser.businessName}
                </p>
              </div>

              {/* Assigned Scenarios */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Assigned Scenarios ({assignedScenarios.length})
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg max-h-[200px] overflow-y-auto">
                  {assignedScenarios.length > 0 ? (
                    assignedScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="flex items-center justify-between p-3 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {scenario.scenarioCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {scenario.scenarioDescription}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnassign(scenario.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Unassign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No scenarios assigned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Scenarios */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Available Scenarios ({availableScenarios.length})
                  </h3>
                  {selectedScenarios.length > 0 && (
                    <button
                      onClick={handleBulkAssign}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Assign ({selectedScenarios.length})
                    </button>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto">
                  {scenariosLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                    </div>
                  ) : availableScenarios.length > 0 ? (
                    availableScenarios.map((scenario) => (
                      <label
                        key={scenario.id}
                        className="flex items-start gap-3 p-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario.id)}
                          onChange={() => toggleScenarioSelection(scenario.id)}
                          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {scenario.scenarioCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {scenario.scenarioDescription}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Layers className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">All scenarios assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Select a user to manage</p>
              <p className="text-gray-400 mt-2">
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
