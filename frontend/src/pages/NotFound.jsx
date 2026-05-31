import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col relative overflow-hidden">
      
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 z-10">
        <div className="glass-card p-10 max-w-md w-full text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-purple to-electric-cyan"></div>
          
          <div className="text-5xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-electric-purple to-electric-cyan bg-clip-text text-transparent">
            404
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-100">Page Not Found</h2>
            <p className="text-xs text-slate-450 leading-relaxed">
              The requested dashboard link or SaaS page does not exist on this server. Check your URL parameters and try again.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-electric-purple to-electric-cyan hover:from-electric-purple/95 hover:to-electric-cyan/95 text-white font-semibold text-xs rounded-lg shadow-lg shadow-electric-purple/20 transition-all hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go Back Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default NotFound;
