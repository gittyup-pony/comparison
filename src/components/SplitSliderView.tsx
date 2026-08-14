import React, { useState, useRef, useEffect } from 'react';
import { DevicePreset } from '../types';
import { Sliders, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';

interface SplitSliderViewProps {
  url1: string;
  url2: string;
  useProxy: boolean;
  selectedDevice: DevicePreset;
  zoomScale: number;
  refreshKey: number;
}

export const SplitSliderView: React.FC<SplitSliderViewProps> = ({
  url1,
  url2,
  useProxy,
  selectedDevice,
  zoomScale,
  refreshKey,
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetUrl1 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url1)}`
    : url1;
  const targetUrl2 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url2)}`
    : url2;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 2) pos = 2;
    if (pos > 98) pos = 98;
    setSliderPos(pos);
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const devWidth = selectedDevice.width > 0 ? selectedDevice.width : 1200;

  return (
    <div className="flex-1 bg-slate-950 p-4 min-h-[calc(100vh-170px)] flex flex-col items-center">
      <div className="max-w-[1600px] w-full flex flex-col items-center gap-4">
        {/* Helper Banner & Presets */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Interactive Wipe Slider:</span>
            <span>Drag the central divider line left or right to wipe between V1 and V2.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Quick Split:</span>
            {[25, 50, 75].map((preset) => (
              <button
                key={preset}
                onClick={() => setSliderPos(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  sliderPos === preset
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {preset}%
              </button>
            ))}
          </div>
        </div>

        {/* Outer Frame Wrapper */}
        <div
          ref={containerRef}
          className="relative w-full h-[750px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-800 select-none cursor-col-resize"
          style={{ maxWidth: `${devWidth}px` }}
        >
          {/* Layer 1: Website 2 (Right / Base) */}
          <div className="absolute inset-0 w-full h-full">
            <iframe
              key={`v2-${refreshKey}`}
              src={targetUrl2}
              className="w-full h-full border-0"
              title="Website 2 Split View"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            {/* Top Badge Right */}
            <div className="absolute top-3 right-3 bg-indigo-950/90 text-indigo-200 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none flex items-center gap-1.5 z-10">
              <Sparkles className="w-3 h-3 text-indigo-400" /> V2 (New Redesign)
            </div>
          </div>

          {/* Layer 2: Website 1 (Left / Clipped Overlay) */}
          <div
            className="absolute top-0 left-0 bottom-0 overflow-hidden bg-white z-10"
            style={{ width: `${sliderPos}%` }}
          >
            <div
              className="h-full relative"
              style={{ width: `${containerRef.current?.getBoundingClientRect().width || devWidth}px` }}
            >
              <iframe
                key={`v1-${refreshKey}`}
                src={targetUrl1}
                className="w-full h-full border-0"
                title="Website 1 Split View"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
              {/* Top Badge Left */}
              <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-200 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold shadow-lg pointer-events-none z-10">
                V1 (Original)
              </div>
            </div>
          </div>

          {/* Vertical Divider Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 via-white to-emerald-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-30 flex items-center justify-center cursor-col-resize"
            style={{ left: `calc(${sliderPos}% - 2px)` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-8 h-12 bg-slate-900 border-2 border-indigo-400 rounded-full flex items-center justify-center shadow-xl text-white text-xs font-bold gap-0.5 transform transition-transform hover:scale-110">
              ‹›
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
