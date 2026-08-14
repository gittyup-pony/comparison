import React from 'react';
import { ViewMode } from '../types';
import { 
  Columns3, 
  Split, 
  Rows3, 
  Eye, 
  BarChart3, 
  CheckSquare, 
  Sparkles, 
  Download, 
  RefreshCw,
  Building2
} from 'lucide-react';

interface HeaderProps {
  activeMode: ViewMode;
  setActiveMode: (mode: ViewMode) => void;
  onRefreshAll: () => void;
  onExportReport: () => void;
  onInspectSites: () => void;
  isInspecting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  setActiveMode,
  onRefreshAll,
  onExportReport,
  onInspectSites,
  isInspecting,
}) => {
  const modes: { id: ViewMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'side-by-side', label: 'Side by Side', icon: <Columns3 className="w-4 h-4" />, desc: 'Dual viewport view' },
    { id: 'split-slider', label: 'Split Slider', icon: <Split className="w-4 h-4" />, desc: 'Overlay wipe comparison' },
    { id: 'stacked', label: 'Stacked', icon: <Rows3 className="w-4 h-4" />, desc: 'Top & bottom layout' },
    { id: 'focus-toggle', label: 'Focus Toggle', icon: <Eye className="w-4 h-4" />, desc: 'Quick flip switch' },
    { id: 'audit-matrix', label: 'Audit Matrix', icon: <BarChart3 className="w-4 h-4" />, desc: 'Technical & SEO diff' },
    { id: 'notes', label: 'Review Notes', icon: <CheckSquare className="w-4 h-4" />, desc: 'Feature comparison checklist' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-[1800px] mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Property Showcase Comparison
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                V1 vs V2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive side-by-side visual, layout, and technical comparison
            </p>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
          {modes.map((m) => {
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                title={m.desc}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onInspectSites}
            disabled={isInspecting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Inspect site meta tags, headings, images, and load performance"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isInspecting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Run Audit</span>
          </button>

          <button
            onClick={onRefreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Refresh both viewports"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reload Both</span>
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-colors cursor-pointer"
            title="Export full comparison report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
