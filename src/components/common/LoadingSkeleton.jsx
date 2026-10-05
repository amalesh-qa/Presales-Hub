import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-8 bg-slate-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Executive Briefing Skeleton */}
      <div className="h-44 rounded-2xl bg-slate-900 border border-slate-800 p-6"></div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-80 rounded-2xl bg-slate-900 border border-slate-800 p-6"></div>
        ))}
      </div>
    </div>
  );
}
