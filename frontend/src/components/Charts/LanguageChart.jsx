import React, { useState } from 'react';

const LANGUAGE_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Python: '#3776AB',
  Java: '#B07219',
  Go: '#00ADD8',
  Rust: '#DEA584',
  C: '#555555',
  'C++': '#F34B7D',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89E051',
  Vue: '#41B883',
  React: '#61DAFB',
  Unknown: '#4B5563'
};

const LanguageChart = ({ repos = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const languageCounts = {};
  let totalReposWithLang = 0;

  repos.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      totalReposWithLang++;
    }
  });

  const languageData = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: parseFloat(((count / totalReposWithLang) * 100).toFixed(1)),
      color: LANGUAGE_COLORS[name] || '#6B7280'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (languageData.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-72 text-center">
        <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-semibold text-slate-400">No language data found</span>
        <span className="text-xs text-slate-555 max-w-xs mt-1 leading-normal">This user does not have any repositories with associated programming languages.</span>
      </div>
    );
  }

  const size = 160;
  const radius = 60;
  const strokeWidth = 14;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = -90;

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-76 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-purple/10 to-transparent"></div>
      
      <div className="mb-4">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>Language Share</span>
          <span className="w-1.5 h-1.5 rounded-full bg-electric-purple animate-pulse"></span>
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Animated SVG Donut Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#111827"
              strokeWidth={strokeWidth}
            />

            {languageData.map((slice, idx) => {
              const strokeLength = (slice.percentage / 100) * circumference;
              const strokeOffset = circumference - strokeLength;
              const angleRotation = accumulatedAngle;
              
              accumulatedAngle += (slice.percentage / 100) * 360;

              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={slice.name}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  transform={`rotate(${angleRotation} ${center} ${center})`}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="transition-all duration-300 cursor-pointer origin-center"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 6px ${slice.color}60)` : 'none'
                  }}
                />
              );
            })}
          </svg>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in">
            {hoveredIdx !== null ? (
              <>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {languageData[hoveredIdx].name}
                </span>
                <span className="text-xl font-extrabold text-slate-200 font-mono">
                  {languageData[hoveredIdx].percentage}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest">
                  Total Language
                </span>
                <span className="text-xl font-extrabold text-slate-200 font-mono">
                  {languageData.length}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-grow space-y-2.5 w-full">
          {languageData.map((slice, idx) => (
            <div
              key={slice.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                hoveredIdx === idx ? 'bg-obsidian-800' : 'hover:bg-obsidian-900/30'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: slice.color }}
                ></span>
                <span className="text-xs font-semibold text-slate-350">{slice.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-right">
                <span className="text-[10px] font-mono text-slate-550">{slice.count} repos</span>
                <span className="text-xs font-bold text-slate-300 font-mono">{slice.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LanguageChart;
