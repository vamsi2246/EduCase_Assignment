import React from 'react';

const StatsCard = ({ profile }) => {
  if (!profile) return null;

  const stats = [
    {
      label: 'Total Stars',
      val: profile.total_stars,
      glow: 'border-glow-cyan',
      icon: (
        <svg className="w-4 h-4 text-electric-cyan fill-electric-cyan/5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.9 1.5-.9 1.8 0l1.518 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.974 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.9-.75 1.62-1.5 1.18L10 17.618l-3.83 2.809c-.75.44-1.8-.33-1.5-1.18l1.518-4.674a1 1 0 00-.364-1.118L1.82 9.4c-.77-.56-.372-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.518-4.674z" />
        </svg>
      )
    },
    {
      label: 'Total Forks',
      val: profile.total_forks,
      glow: 'border-glow-purple',
      icon: (
        <svg className="w-4 h-4 text-electric-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      label: 'Public Repos',
      val: profile.public_repos,
      glow: 'border-glow-emerald',
      icon: (
        <svg className="w-4 h-4 text-electric-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      label: 'Account Lifespan',
      val: `${profile.account_age_years} yrs`,
      glow: 'border-glow-orange',
      icon: (
        <svg className="w-4 h-4 text-electric-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {stats.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 bg-obsidian-900 border border-obsidian-800 rounded-xl flex flex-col justify-between h-24 shadow transition-all duration-300 hover:scale-[1.02] hover:border-obsidian-600 ${card.glow}`}
        >
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>{card.label}</span>
            {card.icon}
          </span>
          <span className="text-xl font-bold text-slate-200 font-mono tracking-tight">{card.val}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
