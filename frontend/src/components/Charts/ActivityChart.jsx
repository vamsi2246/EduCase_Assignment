import React, { useState } from 'react';

const ActivityChart = ({ repos = [] }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const sortedRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 5);

  if (sortedRepos.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-76 text-center">
        <svg className="w-12 h-12 text-slate-650 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-semibold text-slate-400">No repository data available</span>
      </div>
    );
  }

  const maxMetricValue = Math.max(
    ...sortedRepos.flatMap(r => [r.stargazers_count || 0, r.forks_count || 0]),
    5
  );

  const chartWidth = 460;
  const chartHeight = 180;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;
  
  const totalSections = sortedRepos.length;
  const sectionWidth = graphWidth / totalSections;
  const barGroupWidth = sectionWidth * 0.6;
  const barWidth = barGroupWidth * 0.4;

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-76 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-cyan/10 to-transparent"></div>
      
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between w-full">
          <span>Popular Repos Comparison</span>
          <span className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 font-sans text-[10px] tracking-normal text-slate-500">
              <span className="w-2 h-2 rounded bg-electric-cyan inline-block"></span>
              <span>Stars</span>
            </span>
            <span className="flex items-center space-x-1 font-sans text-[10px] tracking-normal text-slate-500">
              <span className="w-2 h-2 rounded bg-electric-purple inline-block"></span>
              <span>Forks</span>
            </span>
          </span>
        </h3>
      </div>

      <div className="relative w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          width="100%"
          height={chartHeight}
          className="min-w-[400px] overflow-visible animate-fade-in"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + graphHeight * (1 - ratio);
            const val = Math.round(maxMetricValue * ratio);
            return (
              <g key={index}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#111827"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fill="#6B7280"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {sortedRepos.map((repo, repoIdx) => {
            const sectionCenter = paddingLeft + (repoIdx * sectionWidth) + (sectionWidth / 2);
            
            const xStars = sectionCenter - (barGroupWidth / 2);
            const xForks = sectionCenter - (barGroupWidth / 2) + barWidth + (barGroupWidth * 0.1);

            const starsHeight = ((repo.stargazers_count || 0) / maxMetricValue) * graphHeight;
            const forksHeight = ((repo.forks_count || 0) / maxMetricValue) * graphHeight;

            const yStars = paddingTop + graphHeight - starsHeight;
            const yForks = paddingTop + graphHeight - forksHeight;

            const isStarsHovered = hoveredBar?.repoIdx === repoIdx && hoveredBar?.type === 'stars';
            const isForksHovered = hoveredBar?.repoIdx === repoIdx && hoveredBar?.type === 'forks';

            return (
              <g key={repo.id}>
                {/* Stars Bar */}
                <rect
                  x={xStars}
                  y={yStars}
                  width={barWidth}
                  height={Math.max(2, starsHeight)}
                  fill={isStarsHovered ? '#22d3ee' : '#0891b2'}
                  rx="3"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredBar({ repoIdx, type: 'stars' })}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    filter: isStarsHovered ? 'drop-shadow(0 0 4px rgba(6,182,212,0.6))' : 'none'
                  }}
                />

                {/* Forks Bar */}
                <rect
                  x={xForks}
                  y={yForks}
                  width={barWidth}
                  height={Math.max(2, forksHeight)}
                  fill={isForksHovered ? '#a78bfa' : '#7c3aed'}
                  rx="3"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredBar({ repoIdx, type: 'forks' })}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    filter: isForksHovered ? 'drop-shadow(0 0 4px rgba(139,92,246,0.6))' : 'none'
                  }}
                />

                <text
                  x={sectionCenter}
                  y={chartHeight - 8}
                  fill="#9CA3AF"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {repo.name.length > 10 ? `${repo.name.slice(0, 9)}…` : repo.name}
                </text>
              </g>
            );
          })}

          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={paddingTop + graphHeight}
            stroke="#1F2937"
            strokeWidth="1.5"
          />

          <line
            x1={paddingLeft}
            y1={paddingTop + graphHeight}
            x2={chartWidth - paddingRight}
            y2={paddingTop + graphHeight}
            stroke="#1F2937"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {hoveredBar !== null && (
        <div className="absolute top-[60px] left-[20px] px-3 py-1.5 rounded-lg bg-obsidian-950/95 border border-obsidian-750 text-[10px] font-mono shadow-xl flex items-center space-x-2 animate-fade-in pointer-events-none">
          <span className="font-semibold text-slate-300">{sortedRepos[hoveredBar.repoIdx].name}</span>
          <span className="text-slate-550">|</span>
          <span className={hoveredBar.type === 'stars' ? 'text-electric-cyan' : 'text-electric-purple'}>
            {hoveredBar.type.toUpperCase()}: {
              hoveredBar.type === 'stars'
                ? sortedRepos[hoveredBar.repoIdx].stargazers_count
                : sortedRepos[hoveredBar.repoIdx].forks_count
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default ActivityChart;
