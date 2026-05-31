import React from 'react';

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="glass-card p-6 flex flex-col justify-between items-center text-center relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-obsidian-700 to-transparent"></div>
      
      <div className="flex flex-col items-center space-y-4 w-full">
        {/* Avatar */}
        <img
          src={profile.avatar_url || 'https://github.com/github.png'}
          alt={profile.username}
          className="w-24 h-24 rounded-full bg-gray-800 border-2 border-obsidian-700 shadow-xl"
        />
        
        {/* Name and Handle */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 tracking-tight leading-tight">
            {profile.name || profile.username}
          </h2>
          <a
            href={`https://github.com/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-electric-cyan hover:underline inline-flex items-center space-x-1 mt-1 animate-pulse"
          >
            <span>@{profile.username}</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-slate-400 max-w-sm line-clamp-3 leading-relaxed mt-2 italic px-3">
            "{profile.bio}"
          </p>
        )}
      </div>

      {/* Meta Lists */}
      <div className="w-full space-y-3 mt-8 border-t border-obsidian-800/80 pt-6 text-left">
        
        {/* Location */}
        {profile.location && (
          <div className="flex items-center space-x-2.5 text-xs text-slate-450">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{profile.location}</span>
          </div>
        )}

        {/* Followers / Following counts */}
        <div className="flex items-center space-x-2.5 text-xs text-slate-450">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>
            <strong className="text-slate-350">{profile.followers}</strong> followers <span className="text-slate-650">•</span> <strong className="text-slate-350">{profile.following}</strong> following
          </span>
        </div>

        {/* Followers-Following Ratio */}
        <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-obsidian-950/60 border border-obsidian-800/40">
          <span className="text-slate-500 font-mono text-[10px] uppercase">Followers-Following Ratio</span>
          <span className="font-bold text-slate-200 font-mono">{profile.followers_following_ratio}x</span>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;
