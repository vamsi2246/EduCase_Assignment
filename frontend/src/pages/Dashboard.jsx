import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar/Navbar';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import StatsCard from '../components/StatsCard/StatsCard';
import LanguageChart from '../components/Charts/LanguageChart';
import ActivityChart from '../components/Charts/ActivityChart';
import RepositoryList from '../components/Charts/RepositoryList';
import SkeletonLoader from '../components/Loader/SkeletonLoader';
import Footer from '../components/Footer/Footer';

const Dashboard = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/profile/${username}`);
        setProfile(response.data);
      } catch (err) {
        setError(err.message || 'Failed to analyze GitHub profile.');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col">
        <Navbar />
        <SkeletonLoader />
      </div>
    );
  }

  // Error Card Screen
  if (error) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-550/5 rounded-full blur-[120px] pointer-events-none"></div>
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 z-10">
          <div className="glass-card p-8 max-w-md w-full text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500"></div>
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-500/25">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-100">Analysis Interrupted</h2>
              <p className="text-xs text-slate-450 leading-relaxed">{error}</p>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700/80 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-electric-cyan/10 text-electric-cyan border-electric-cyan/25 border-glow-cyan';
      case 'Advanced':
        return 'bg-electric-purple/10 text-electric-purple border-electric-purple/25 border-glow-purple';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/25';
    }
  };

  const circleSize = 130;
  const strokeW = 10;
  const rad = 50;
  const centerCoord = circleSize / 2;
  const circ = 2 * Math.PI * rad;
  const strokeOffsetDash = circ - (profile.profile_score / 100) * circ;

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col relative overflow-hidden">
      
      {/* Dynamic Background soft glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-cyan/5 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-purple/5 rounded-full blur-[130px] pointer-events-none"></div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8 z-10">
        
        {/* Navigation Breadcrumbs Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-1 text-slate-400 hover:text-electric-cyan transition-colors text-xs font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to search</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-550">Last Synced: {new Date(profile.updated_at).toLocaleString()}</span>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column A: Reusable Profile Card component */}
          <div>
            <ProfileCard profile={profile} />
          </div>

          {/* Column B: Score Dial Gauge and Highlight StatsCard component */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Score Dial Gauge */}
            <div className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-cyan/25 to-transparent"></div>
              
              {/* SVG vector score gauge */}
              <div className="relative flex-shrink-0" style={{ width: circleSize, height: circleSize }}>
                <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`} className="transform -rotate-90">
                  <circle
                    cx={centerCoord}
                    cy={centerCoord}
                    r={rad}
                    fill="transparent"
                    stroke="#111827"
                    strokeWidth={strokeW}
                  />
                  <circle
                    cx={centerCoord}
                    cy={centerCoord}
                    r={rad}
                    fill="transparent"
                    stroke="url(#dashGradient)"
                    strokeWidth={strokeW}
                    strokeDasharray={circ}
                    strokeDashoffset={strokeOffsetDash}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="dashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold text-slate-100 leading-tight font-mono">{profile.profile_score}</span>
                  <span className="text-[9px] font-mono text-slate-550 uppercase tracking-widest -mt-0.5">Score</span>
                </div>
              </div>

              {/* Ranks & Activity explanation */}
              <div className="flex-grow space-y-3 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Developer Class</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border max-w-xs mx-auto sm:mx-0 ${getLevelBadgeClass(profile.developer_level)}`}>
                    {profile.developer_level.toUpperCase()} LEVEL
                  </span>
                </div>
                
                {profile.recent_activity_insights && (
                  <div className="p-3.5 bg-obsidian-950/60 border border-obsidian-800/60 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Qualitative Insight</span>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      {profile.recent_activity_insights.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reusable Stats Card Grid component */}
            <StatsCard profile={profile} />

          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LanguageChart repos={profile.repositories} />
          <ActivityChart repos={profile.repositories} />
        </div>

        {/* Repos explorer list */}
        <RepositoryList repos={profile.repositories} />

      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
