import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialValue = '', placeholder = 'Enter GitHub handle (e.g. torvalds)' }) => {
  const [username, setUsername] = useState(initialValue);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const GITHUB_USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();

    if (!trimmedUser) {
      setError('Please provide a GitHub username.');
      return;
    }

    if (!GITHUB_USERNAME_REGEX.test(trimmedUser)) {
      setError('Invalid username format. Use alphanumeric characters and hyphens only.');
      return;
    }

    setError('');
    navigate(`/dashboard/${trimmedUser}`);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800 focus-within:border-electric-cyan/50 focus-within:shadow-lg focus-within:shadow-electric-cyan/5 transition-all">
          
          <div className="relative flex-grow flex items-center pl-3">
            <svg className="w-5 h-5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={placeholder}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-transparent text-slate-200 outline-none placeholder-slate-500 text-sm py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-electric-purple to-electric-cyan hover:from-electric-purple/90 hover:to-electric-cyan/90 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-electric-purple/20 hover:shadow-electric-purple/30 group"
          >
            <span>Analyze</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        {error && (
          <p className="text-left pl-3 text-red-500 text-xs mt-2 font-medium flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
