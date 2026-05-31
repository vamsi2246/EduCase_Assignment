import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse select-none">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile skeleton */}
        <div className="glass-card p-6 flex flex-col items-center space-y-4">
          <div className="w-28 h-28 rounded-full bg-gray-800"></div>
          <div className="h-6 w-32 bg-gray-800 rounded"></div>
          <div className="h-4 w-24 bg-gray-800 rounded"></div>
          <div className="h-10 w-full bg-gray-800 rounded mt-4"></div>
          <div className="w-full space-y-2 mt-6">
            <div className="h-4 w-full bg-gray-800 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-800 rounded"></div>
          </div>
        </div>

        {/* Stats and charts skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="h-8 w-48 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-obsidian-950 p-4 rounded-lg border border-obsidian-700/40 space-y-2">
                  <div className="h-3 w-16 bg-gray-805 bg-gray-800 rounded"></div>
                  <div className="h-6 w-12 bg-gray-808 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-6 h-64 bg-obsidian-900/50"></div>
            <div className="glass-card p-6 h-64 bg-obsidian-900/50"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkeletonLoader;
