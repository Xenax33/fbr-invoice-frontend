"use client";

import UserLayout from "@/components/layouts/UserLayout";
import { Loader2, Layers, FileText } from "lucide-react";
import { useMyScenarios } from "@/hooks/useScenarios";

export default function ScenariosPage() {
  // Fetch user's assigned scenarios
  const { data: scenarios, isLoading, error } = useMyScenarios();

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Scenarios
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 flex items-center">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-purple-600" />
            Scenarios assigned to you for use in invoices
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isLoading ? (
            // Loading State
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 sm:h-40 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse"
                />
              ))}
            </>
          ) : error ? (
            // Error State
            <div className="col-span-full">
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 p-6 sm:p-8 text-center">
                <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-red-300 mb-3 sm:mb-4" />
                <p className="text-red-600 font-bold text-base sm:text-lg">
                  Error loading scenarios
                </p>
                <p className="text-xs sm:text-sm text-red-500 mt-2">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          ) : scenarios && scenarios.length > 0 ? (
            // Scenarios Grid
            scenarios.map((scenario) => (
              <div
                key={scenario.assignmentId}
                className="group rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-xs font-bold text-slate-500 bg-slate-100 px-2 sm:px-2.5 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-200">
                    #{scenario.scenarioId}
                  </span>
                </div>

                <div className="mb-4 sm:mb-5">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1 line-clamp-2">
                    {scenario.scenarioCode}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3">
                    {scenario.scenarioDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t-2 border-slate-100 pt-3 sm:pt-4">
                  <span className="text-xs sm:text-xs text-slate-500">
                    Assigned{" "}
                    <span className="font-semibold text-slate-700">
                      {new Date(scenario.assignedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <div className="h-2 w-2 sm:h-2 sm:w-2 rounded-full bg-green-500" />
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full">
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-slate-300 p-8 sm:p-12 lg:p-16 text-center">
                <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
                <p className="text-slate-700 font-bold text-base sm:text-lg">
                  No scenarios assigned yet
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Contact your administrator to get scenarios assigned to your account
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        {scenarios && scenarios.length > 0 && (
          <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    Active Scenarios
                  </p>
                  <p className="text-xs text-slate-600">
                    Ready to use in your invoices
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {scenarios.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
