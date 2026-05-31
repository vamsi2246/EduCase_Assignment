import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-obsidian-950/80 backdrop-blur-md border-b border-obsidian-800/60 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-electric-purple to-electric-cyan flex items-center justify-center shadow-lg shadow-electric-purple/20 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">GitGauge</span>
            <span className="text-[10px] block -mt-1 font-mono tracking-widest text-electric-cyan uppercase">SaaS Analyzer</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'bg-obsidian-800 text-electric-cyan border border-obsidian-700/60' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/history') 
                ? 'bg-obsidian-800 text-electric-cyan border border-obsidian-700/60' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50'
            }`}
          >
            Search Logs
          </Link>
          <a
            href="http://localhost:5001/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-obsidian-900/50 flex items-center space-x-1"
          >
            <span>Swagger Specs</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
