import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Title Skeleton */}
      <div className="h-8 bg-slate-800 rounded-lg w-3/4 mb-8"></div>
      
      {/* Text Lines */}
      <div className="space-y-3">
        <div className="h-4 bg-slate-800/50 rounded w-full"></div>
        <div className="h-4 bg-slate-800/50 rounded w-11/12"></div>
        <div className="h-4 bg-slate-800/50 rounded w-full"></div>
        <div className="h-4 bg-slate-800/50 rounded w-5/6"></div>
      </div>

      {/* Chart/Visual Skeleton */}
      <div className="mt-8 h-64 bg-slate-900 border border-slate-800 rounded-xl w-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-900/50 animate-spin"></div>
      </div>

      {/* Text Lines */}
      <div className="space-y-3 mt-8">
        <div className="h-4 bg-slate-800/50 rounded w-11/12"></div>
        <div className="h-4 bg-slate-800/50 rounded w-full"></div>
        <div className="h-4 bg-slate-800/50 rounded w-4/5"></div>
      </div>
    </div>
  );
};