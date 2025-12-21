
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass border border-slate-800 rounded-2xl shadow-2xl relative group overflow-hidden ${className}`}>
    {/* Subtle Inner Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    {children}
  </div>
);

export const CardHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="px-8 py-5 border-b border-slate-800/50 flex justify-between items-center bg-white/5 backdrop-blur-md">
    <h3 className="text-lg font-black text-slate-200 tracking-tight flex items-center gap-3">
      <span className="w-1.5 h-4 bg-cyan-500 rounded-full inline-block"></span>
      {title}
    </h3>
    {action && <div>{action}</div>}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);
