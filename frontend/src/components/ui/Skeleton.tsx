import React from "react";

// ==========================================
// Base Reusable Skeleton Component
// ==========================================
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-zinc-100 border border-zinc-200/50 ${className}`}
      {...props}
    />
  );
}

export default Skeleton;

// ==========================================
// 1. StatCard Skeleton
// ==========================================
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-7 w-14" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

// ==========================================
// 2. Dashboard Tab Skeleton
// ==========================================
export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* GitHub Contribution Calendar Box */}
      <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        
        {/* Calendar grid placeholder */}
        <div className="py-2 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="h-36 w-full rounded-lg bg-zinc-50/60 border border-zinc-100 p-4 flex flex-col justify-between">
            <div className="grid grid-cols-12 sm:grid-cols-16 gap-1.5 h-full opacity-60">
              {Array.from({ length: 48 }).map((_, i) => (
                <Skeleton key={i} className="h-3.5 w-full rounded-[2px]" />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-2.5 w-28" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-2.5 w-8" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-2.5 w-2.5 rounded-[2px]" />
                ))}
              </div>
              <Skeleton className="h-2.5 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Profile Details Box */}
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3.5 w-20" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <div className="p-3 bg-zinc-50/60 border border-zinc-200/60 rounded-lg space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-4 mt-2">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-4 w-10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Tools: Backup Data */}
      <div className="lg:col-span-3">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. About Tab Skeleton
// ==========================================
export function AboutSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>

      {/* Sub-tab navigation */}
      <div className="flex border-b border-zinc-200/80 px-6 bg-zinc-50/50 gap-4 py-2.5">
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="h-7 w-36 rounded-md" />
        <Skeleton className="h-7 w-32 rounded-md" />
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8 space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>

        <div className="pt-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. Skills Tab Skeleton
// ==========================================
export function SkillsSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="p-4 px-6 border-b border-zinc-150 bg-zinc-50/50 flex flex-wrap items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-36 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[10px] uppercase">
              <th className="py-3 px-6"><Skeleton className="h-3 w-20" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-24" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-20" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-28" /></th>
              <th className="py-3 px-6 text-right"><Skeleton className="h-3 w-12 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150">
            {[...Array(6)].map((_, i) => (
              <tr key={i} className="hover:bg-zinc-50/40">
                <td className="py-3.5 px-6">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </td>
                <td className="py-3.5 px-6">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="py-3.5 px-6">
                  <Skeleton className="h-5 w-36 rounded-full" />
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3.5 w-8" />
                    <Skeleton className="w-36 h-1.5 rounded-full" />
                  </div>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex justify-end items-center gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 5. Projects Tab Skeleton
// ==========================================
export function ProjectsSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3 w-72 max-w-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[10px] uppercase">
              <th className="py-3 px-6"><Skeleton className="h-3 w-16" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-28" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-28" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-24" /></th>
              <th className="py-3 px-6 text-right"><Skeleton className="h-3 w-12 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="hover:bg-zinc-50/40">
                <td className="py-3.5 px-6">
                  <Skeleton className="h-12 w-20 rounded-md shrink-0" />
                </td>
                <td className="py-3.5 px-6 max-w-[220px]">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-14 rounded" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td className="py-3.5 px-6 max-w-[280px]">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-48" />
                    <div className="flex gap-1">
                      <Skeleton className="h-3.5 w-12 rounded" />
                      <Skeleton className="h-3.5 w-10 rounded" />
                      <Skeleton className="h-3.5 w-14 rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6">
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex justify-end items-center gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 6. Experience Tab Skeleton
// ==========================================
export function ExperienceSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[10px] uppercase">
              <th className="py-3 px-6"><Skeleton className="h-3 w-28" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-24" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-16" /></th>
              <th className="py-3 px-6"><Skeleton className="h-3 w-24" /></th>
              <th className="py-3 px-6 text-right"><Skeleton className="h-3 w-12 ml-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="hover:bg-zinc-50/40">
                <td className="py-3.5 px-6">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </td>
                <td className="py-3.5 px-6">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </td>
                <td className="py-3.5 px-6">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </td>
                <td className="py-3.5 px-6">
                  <div className="flex gap-1.5 flex-wrap">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-4 w-14 rounded" />
                    <Skeleton className="h-4 w-10 rounded" />
                  </div>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <div className="flex justify-end items-center gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 7. Messages Tab Skeleton
// ==========================================
export function MessagesSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white shadow-2xs space-y-0 overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 border-b border-zinc-200/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-80 max-w-full" />
        </div>
      </div>

      {/* Messages list */}
      <div className="divide-y divide-zinc-150">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 sm:p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <Skeleton className="h-9 w-9 rounded-full shrink-0 mt-0.5" />
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-4 w-10 rounded" />
                </div>
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3 w-3/4 max-w-md" />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. Full Page Auth Loading Skeleton
// ==========================================
export function AuthLoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans antialiased text-zinc-900">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 border-r border-zinc-200/80 bg-white flex-col justify-between shrink-0 min-h-screen select-none">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-28" />
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>

          {/* Nav Items */}
          <div className="p-3 space-y-5">
            <div>
              <Skeleton className="h-2.5 w-16 px-3 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>

            <div>
              <Skeleton className="h-2.5 w-20 px-3 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-150 space-y-2">
          <div className="p-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/60 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-200/80 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 space-y-6 flex-1">
          {/* Page Title */}
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3.5 w-96 max-w-full" />
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Main Dashboard Grid */}
          <DashboardSkeleton />
        </main>
      </div>
    </div>
  );
}
