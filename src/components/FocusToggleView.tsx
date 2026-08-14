import React, { useState, useEffect } from 'react';
import { DevicePreset } from '../types';
import { Eye, RefreshCw, ExternalLink, Sparkles, Play, Square } from 'lucide-react';

interface FocusToggleViewProps {
  url1: string;
  url2: string;
  useProxy: boolean;
  selectedDevice: DevicePreset;
  refreshKey: number;
}

export const FocusToggleView: React.FC<FocusToggleViewProps> = ({
  url1,
  url2,
  useProxy,
  selectedDevice,
  refreshKey,
}) => {
  const [activeSite, setActiveSite] = useState<'v1' | 'v2'>('v1');
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  const [flipSpeed, setFlipSpeed] = useState<number>(1500); // ms

  const targetUrl1 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url1)}`
    : url1;
  const targetUrl2 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url2)}`
    : url2;

  // Hotkey listener for instant switching (Key '1' = V1, Key '2' = V2, Space = Toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '1') {
        setActiveSite('v1');
      } else if (e.key === '2') {
        setActiveSite('v2');
      } else if (e.code === 'Space') {
        e.preventDefault();
        setActiveSite((prev) => (prev === 'v1' ? 'v2' : 'v1'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto flip timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoFlipping) {
      timer = setInterval(() => {
        setActiveSite((prev) => (prev === 'v1' ? 'v2' : 'v1'));
      }, flipSpeed);
    }
    return () => clearInterval(timer);
  }, [isAutoFlipping, flipSpeed]);

  const devWidth = selectedDevice.width > 0 ? `${selectedDevice.width}px` : '100%';

  return (
    <div className="flex-1 bg-slate-950 p-4 min-h-[calc(100vh-170px)] flex flex-col items-center">
      <div className="max-w-[1600px] w-full flex flex-col items-center gap-4">
        {/* Toggle Controls Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          {/* Left: Active Site Switcher Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Eye className="w-4 h-4 text-indigo-400" /> Focus Target:
            </span>

            <button
              onClick={() => setActiveSite('v1')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSite === 'v1'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-950"></span>
              <span>Website 1 (V1)</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950/30 text-[10px] font-mono text-slate-900">
                Key 1
              </kbd>
            </button>

            <button
              onClick={() => setActiveSite('v2')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSite === 'v2'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Website 2 (V2)</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-950/30 text-[10px] font-mono text-indigo-200">
                Key 2
              </kbd>
            </button>
          </div>

          {/* Center: Hotkey Tip */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Tip: Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">Spacebar</kbd>
            <span>or keys</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">1</kbd>
            <span>/</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px]">2</kbd>
            <span>to switch instantly</span>
          </div>

          {/* Right: Auto-Flip Loop Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoFlipping(!isAutoFlipping)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isAutoFlipping
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isAutoFlipping ? (
                <>
                  <Square className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Stop Auto-Flip</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                  <span>Auto-Flip Loop</span>
                </>
              )}
            </button>

            {isAutoFlipping && (
              <select
                value={flipSpeed}
                onChange={(e) => setFlipSpeed(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
              >
                <option value={800}>0.8s (Fast)</option>
                <option value={1500}>1.5s (Medium)</option>
                <option value={3000}>3.0s (Slow)</option>
              </select>
            )}
          </div>
        </div>

        {/* Viewport Frame */}
        <div
          className="w-full h-[750px] bg-white rounded-xl shadow-2xl border border-slate-800 relative overflow-hidden transition-all"
          style={{ maxWidth: devWidth }}
        >
          {/* Site 1 Frame */}
          <div
            className={`absolute inset-0 transition-opacity duration-150 ${
              activeSite === 'v1' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <iframe
              key={`focus-v1-${refreshKey}`}
              src={targetUrl1}
              className="w-full h-full border-0"
              title="Focus V1"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none">
              Showing V1 (Original)
            </div>
          </div>

          {/* Site 2 Frame */}
          <div
            className={`absolute inset-0 transition-opacity duration-150 ${
              activeSite === 'v2' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <iframe
              key={`focus-v2-${refreshKey}`}
              src={targetUrl2}
              className="w-full h-full border-0"
              title="Focus V2"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            <div className="absolute top-3 left-3 bg-indigo-950/90 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Showing V2 (New Redesign)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
