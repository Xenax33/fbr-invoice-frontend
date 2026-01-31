"use client";

import UserLayout from "@/components/layouts/UserLayout";
import { Layers, FileText } from "lucide-react";
import { useMyScenarios } from "@/hooks/useScenarios";

export default function ScenariosPage() {
  // Fetch user's assigned scenarios
  const { data: scenarios, isLoading, error } = useMyScenarios();

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            My Scenarios
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-300/85 flex items-center">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-emerald-400" />
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
              <div className="rounded-xl sm:rounded-2xl bg-red-900/20 backdrop-blur-xl border-2 border-red-400/30 p-6 sm:p-8 text-center">
                <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-red-400 mb-3 sm:mb-4" />
                <p className="text-red-300 font-bold text-base sm:text-lg">
                  Error loading scenarios
                </p>
                <p className="text-xs sm:text-sm text-red-200/85 mt-2">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          ) : scenarios && scenarios.length > 0 ? (
            // Scenarios Grid
            scenarios.map((scenario) => (
              <div
                key={scenario.assignmentId}
                className="group rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 p-4 sm:p-5 lg:p-6 shadow-md shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/40 hover:border-emerald-400/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-xs sm:text-xs font-bold text-stone-400 bg-white/10 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-full group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-all duration-200">
                    #{scenario.scenarioId}
                  </span>
                </div>

                <div className="mb-4 sm:mb-5">
                  <h3 className="font-bold text-base sm:text-lg text-white mb-1 line-clamp-2">
                    {scenario.scenarioCode}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300/85 line-clamp-3">
                    {scenario.scenarioDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t-2 border-white/10 pt-3 sm:pt-4">
                  <span className="text-xs sm:text-xs text-stone-400">
                    Assigned{" "}
                    <span className="font-semibold text-stone-200">
                      {new Date(scenario.assignedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <div className="h-2 w-2 sm:h-2 sm:w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full">
              <div className="rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 p-8 sm:p-12 lg:p-16 text-center">
                <Layers className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-stone-400 mb-3 sm:mb-4" />
                <p className="text-white font-bold text-base sm:text-lg">
                  No scenarios assigned yet
                </p>
                <p className="text-xs sm:text-sm text-stone-300/85 mt-2">
                  Contact your administrator to get scenarios assigned to your account
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        {scenarios && scenarios.length > 0 && (
          <div className="rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 p-4 sm:p-6 shadow-lg shadow-emerald-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-200">
                    Active Scenarios
                  </p>
                  <p className="text-xs text-stone-400">
                    Ready to use in your invoices
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
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
