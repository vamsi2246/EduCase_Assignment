import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import SearchBar from '../components/SearchBar/SearchBar';
import Footer from '../components/Footer/Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleQuickExplore = (user) => {
    navigate(`/dashboard/${user}`);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col relative overflow-hidden">
      
      {/* Background soft blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-electric-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-obsidian-900 border border-obsidian-800 text-xs font-medium text-slate-400 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse"></span>
          <span>Enterprise Grade Developer Metrics</span>
        </div>

        {/* Hero Headings */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 animate-slide-up">
          Deconstruct Developer Footprints.<br />
          <span className="bg-gradient-to-r from-electric-cyan via-electric-purple to-pink-500 bg-clip-text text-transparent">
            Quantify Impact in Seconds.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Analyze GitHub profiles dynamically. Extract total stars, forks, coding languages, account ages, followers ratios, and generate a weighted index score out of 100 with comprehensive qualitative activity insights.
        </p>

        {/* Search Console component */}
        <div className="w-full mb-12 animate-slide-up">
          <SearchBar />
        </div>

        {/* Quick Explore */}
        <div className="mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-4">Click to inspect legendary devs</span>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { login: 'torvalds', desc: 'Linux & Git' },
              { login: 'gaearon', desc: 'Redux & React' },
              { login: 'yyx990803', desc: 'Vue & Vite' }
            ].map(dev => (
              <button
                key={dev.login}
                onClick={() => handleQuickExplore(dev.login)}
                className="px-4 py-2 bg-obsidian-900/60 border border-obsidian-800 hover:border-obsidian-600 rounded-xl text-left transition-all duration-300 hover:scale-[1.02] flex items-center space-x-3 group"
              >
                <img
                  src={`https://github.com/${dev.login}.png`}
                  alt={dev.login}
                  className="w-7 h-7 rounded-full bg-gray-800 border border-obsidian-750"
                  onError={(e) => { e.target.src = 'https://github.com/github.png'; }}
                />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block -mb-0.5 group-hover:text-electric-cyan transition-colors">@{dev.login}</span>
                  <span className="text-[10px] text-slate-550 font-mono">{dev.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SaaS Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {[
            {
              title: 'Multi-Dimension Grading',
              desc: 'Weighted points assessing public repository counts, total stars, forks, followers reach, and account lifespan.'
            },
            {
              title: 'Chronological Search History',
              desc: 'Automatically records search attempts, saving execution logs, IP coordinates, and error exceptions in MySQL.'
            },
            {
              title: 'SaaS Design System',
              desc: 'Tailwind obsidian backdrop-blurs, glowing borders, custom reactive vector diagrams, and responsive layouts.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card glass-card-hover p-6 text-left relative group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-electric-purple/20 to-transparent group-hover:via-electric-cyan/40 transition-all"></div>
              <h3 className="text-slate-200 font-bold text-sm tracking-tight mb-2 flex items-center justify-between">
                <span>{item.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </main>
      
      <Footer />

    </div>
  );
};

export default Home;
