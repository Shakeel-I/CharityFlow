
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 mono">
      {label}
    </label>
    <input
      className={`w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 mono">
      {label}
    </label>
    <textarea
      className={`w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all duration-300 backdrop-blur-sm min-h-[120px] ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="mb-6">
    <label className="block text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-2 mono">
      {label}
    </label>
    <select
      className={`w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all duration-300 appearance-none backdrop-blur-sm ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-200">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
