import React from 'react';
import { ArrowLeftRight, ExternalLink, ShieldCheck, ShieldAlert, RotateCcw, Globe } from 'lucide-react';
import { DEFAULT_SITE_1, DEFAULT_SITE_2 } from '../data';

interface UrlBarProps {
  url1: string;
  setUrl1: (url: string) => void;
  url2: string;
  setUrl2: (url: string) => void;
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
  onSwap: () => void;
  onReset: () => void;
}

export const UrlBar: React.FC<UrlBarProps> = ({
  url1,
  setUrl1,
  url2,
  setUrl2,
  useProxy,
  setUseProxy,
  onSwap,
  onReset,
}) => {
  const isDefaultPair = url1 === DEFAULT_SITE_1 && url2 === DEFAULT_SITE_2;

  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 py-2.5 px-4 sticky top-[61px] z-30">
      <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row items-center gap-3">
        {/* Left Side: Website 1 Input */}
        <div className="flex-1 w-full flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">V1 (Original)</span>
          </div>
          <div className="flex-1 flex items-center gap-2 min-w-0 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800/80">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
              placeholder="https://..."
            />
          </div>
          <a
            href={url1}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Open V1 in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Center: Swap Button & Proxy Control */}
        <div className="flex items-center gap-2 shrink-0 my-1 xl:my-0">
          <button
            onClick={onSwap}
            className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Swap left and right websites"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setUseProxy(!useProxy)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              useProxy
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
            title="Toggle proxy mode (helps bypass X-Frame-Options embedding locks)"
          >
            {useProxy ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-Block Proxy: ON</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Anti-Block Proxy: OFF</span>
              </>
            )}
          </button>

          {!isDefaultPair && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="Reset to default Property Sample URLs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset URLs</span>
            </button>
          )}
        </div>

        {/* Right Side: Website 2 Input */}
        <div className="flex-1 w-full flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shrink-0">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">V2 (New Redesign)</span>
          </div>
          <div className="flex-1 flex items-center gap-2 min-w-0 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800/80">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
              placeholder="https://..."
            />
          </div>
          <a
            href={url2}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Open V2 in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
