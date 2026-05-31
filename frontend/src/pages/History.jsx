import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history?limit=40');
        setHistory(response.data);
      } catch (err) {
        setError('Failed to load search logs from database.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const handleReanalyze = (user) => {
    navigate(`/dashboard/${user}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'NOT_FOUND':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/25';
      default: // FAILED
        return 'bg-red-500/10 text-red-400 border-red-500/25';
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col relative overflow-hidden">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 space-y-6 animate-fade-in">
        
        {/* Header Title */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2 tracking-tight">
            <svg className="w-5 h-5 text-electric-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Search History Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-550 mt-1">Chronological record of recent GitHub username queries performed on GitGauge.</p>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-electric-purple border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-slate-500">Querying search history databases...</span>
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center text-red-500 space-y-3">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs font-medium">{error}</p>
          </div>
        ) : history.length > 0 ? (
          
          /* Logs Table */
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-obsidian-800/60 text-left text-xs text-slate-350">
                <thead className="bg-obsidian-900/60 text-slate-400 font-mono uppercase text-[9px] tracking-widest border-b border-obsidian-850">
                  <tr>
                    <th scope="col" className="px-6 py-4">User Handle</th>
                    <th scope="col" className="px-6 py-4">IP Location</th>
                    <th scope="col" className="px-6 py-4">Timestamp</th>
                    <th scope="col" className="px-6 py-4">Execution Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800/40 bg-transparent">
                  {history.map((log) => (
                    <tr key={log.id} className="hover:bg-obsidian-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`https://github.com/${log.username}.png`}
                            alt={log.username}
                            className="w-7 h-7 rounded-full bg-gray-800 border border-obsidian-750"
                            onError={(e) => { e.target.src = 'https://github.com/github.png'; }}
                          />
                          <span className="font-bold text-slate-200 hover:text-electric-cyan transition-colors cursor-pointer" onClick={() => handleReanalyze(log.username)}>
                            @{log.username}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-mono text-[10px] text-slate-500">
                        {log.ip_address}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-450">
                        {new Date(log.searched_at).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[9px] font-bold ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                        {log.error_message && (
                          <span className="text-[10px] text-red-500/80 block mt-1 leading-normal max-w-xs truncate">
                            {log.error_message}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleReanalyze(log.username)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-obsidian-900 hover:bg-electric-purple/10 border border-obsidian-850 hover:border-electric-purple/35 text-[10px] font-semibold text-slate-350 hover:text-electric-purple rounded-lg transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                          </svg>
                          <span>Re-analyze</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center space-y-4">
            <svg className="w-12 h-12 text-slate-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-450 block">No search logs registered</span>
            </div>
          </div>
        )}

      </main>

      <Footer />

    </div>
  );
};

export default History;
