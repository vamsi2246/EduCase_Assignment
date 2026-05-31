import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-6 border-t border-obsidian-850 bg-obsidian-950 z-10 w-full">
      <span className="text-xs font-mono text-slate-600 block">
        GitGauge &copy; {new Date().getFullYear()} • Built as a production-grade full-stack recruitment prototype. Open Source.
      </span>
    </footer>
  );
};

export default Footer;
