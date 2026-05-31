import React, { useState, useMemo } from 'react';

const RepositoryList = ({ repos = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('stars');

  const languagesList = useMemo(() => {
    const langs = new Set();
    repos.forEach(repo => {
      if (repo.language) langs.add(repo.language);
    });
    return ['All', ...Array.from(langs)];
  }, [repos]);

  const processedRepos = useMemo(() => {
    return repos
      .filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
        return matchesSearch && matchesLang;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') {
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        }
        if (sortBy === 'forks') {
          return (b.forks_count || 0) - (a.forks_count || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [repos, searchTerm, selectedLanguage, sortBy]);

  return (
    <div className="glass-card p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-obsidian-800/80 pb-6">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <svg className="w-5 h-5 text-electric-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Repository Explorer</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Browse and filter public repositories stored for this profile.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search repo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-obsidian-950/80 border border-obsidian-700/80 text-xs text-slate-200 rounded-lg pl-8 pr-4 py-2 outline-none focus:border-electric-cyan transition-all"
            />
            <svg className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-obsidian-950/80 border border-obsidian-700/80 text-xs text-slate-300 rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-electric-cyan"
          >
            {languagesList.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          {/* Toggles */}
          <div className="flex bg-obsidian-950 rounded-lg p-0.5 border border-obsidian-700/80">
            {[
              { key: 'stars', label: 'Stars' },
              { key: 'forks', label: 'Forks' },
              { key: 'name', label: 'A-Z' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSortBy(tab.key)}
                className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-md transition-all ${
                  sortBy === tab.key 
                    ? 'bg-obsidian-800 text-electric-cyan font-bold shadow' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Cards */}
      {processedRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedRepos.map(repo => (
            <div key={repo.id} className="p-4 bg-obsidian-950/40 border border-obsidian-800/80 rounded-xl hover:border-obsidian-700 hover:bg-obsidian-950/60 transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-slate-200 hover:text-electric-cyan transition-colors flex items-center space-x-1.5 group-hover:underline"
                  >
                    <span>{repo.name}</span>
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {repo.fork && (
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-obsidian-800 border border-obsidian-700 text-slate-500">Fork</span>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                  {repo.description || <span className="italic text-slate-650">No description provided.</span>}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-obsidian-800/60 pt-3 mt-4">
                <div className="flex items-center space-x-4">
                  {repo.language && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan"></span>
                      <span>{repo.language}</span>
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5 text-electric-cyan fill-electric-cyan/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.9 1.5-.9 1.8 0l1.518 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.974 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.9-.75 1.62-1.5 1.18L10 17.618l-3.83 2.809c-.75.44-1.8-.33-1.5-1.18l1.518-4.674a1 1 0 00-.364-1.118L1.82 9.4c-.77-.56-.372-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.518-4.674z" />
                    </svg>
                    <span>{repo.stargazers_count || 0}</span>
                  </span>

                  <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5 text-electric-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>{repo.forks_count || 0}</span>
                  </span>
                </div>

                <span className="text-[9px] font-mono text-slate-650">
                  {parseFloat((repo.size / 1024).toFixed(1))} MB
                </span>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-obsidian-950/20 border border-dashed border-obsidian-800 rounded-xl">
          <svg className="w-10 h-10 text-slate-650 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs font-medium text-slate-500">No repositories match your filters.</span>
        </div>
      )}

    </div>
  );
};

export default RepositoryList;
