import React from 'react';
import { DevicePreset } from '../types';
import { DEVICE_PRESETS } from '../data';
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  RotateCw,
  ZoomIn,
  Link2,
  Unlink2,
  SlidersHorizontal,
  LayoutTemplate
} from 'lucide-react';

interface ToolbarProps {
  selectedDevice: DevicePreset;
  setSelectedDevice: (device: DevicePreset) => void;
  isPortrait: boolean;
  setIsPortrait: (val: boolean) => void;
  zoomScale: number;
  setZoomScale: (val: number) => void;
  splitRatio: '50-50' | '60-40' | '40-60';
  setSplitRatio: (ratio: '50-50' | '60-40' | '40-60') => void;
  syncScroll: boolean;
  setSyncScroll: (val: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedDevice,
  setSelectedDevice,
  isPortrait,
  setIsPortrait,
  zoomScale,
  setZoomScale,
  splitRatio,
  setSplitRatio,
  syncScroll,
  setSyncScroll,
}) => {
  const getDeviceIcon = (iconType: string) => {
    switch (iconType) {
      case 'desktop':
        return <Monitor className="w-3.5 h-3.5" />;
      case 'laptop':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      case 'smartphone':
        return <Smartphone className="w-3.5 h-3.5" />;
      default:
        return <Maximize2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Device Viewport Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Viewport:
          </span>
          {DEVICE_PRESETS.map((dev) => {
            const isSelected = selectedDevice.id === dev.id;
            return (
              <button
                key={dev.id}
                onClick={() => setSelectedDevice(dev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50'
                }`}
              >
                {getDeviceIcon(dev.icon)}
                <span>{dev.name}</span>
                {dev.width > 0 && (
                  <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    ({dev.width}px)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Device Controls: Orientation, Zoom, Column Ratio, Sync Scroll */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Orientation Toggle (if non-fluid device selected) */}
          {selectedDevice.width > 0 && (
            <button
              onClick={() => setIsPortrait(!isPortrait)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer`}
              title="Rotate Screen Orientation"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isPortrait ? 'Portrait' : 'Landscape'}</span>
            </button>
          )}

          {/* Column Ratio Picker (50-50, 60-40, 40-60) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 px-1.5 flex items-center gap-1">
              <LayoutTemplate className="w-3 h-3 text-slate-400" /> Ratio:
            </span>
            {(['50-50', '60-40', '40-60'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSplitRatio(ratio)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                  splitRatio === ratio
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* Zoom Scale Picker */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <ZoomIn className="w-3 h-3 text-slate-400 ml-1.5" />
            {[0.67, 0.8, 1, 1.25].map((scale) => (
              <button
                key={scale}
                onClick={() => setZoomScale(scale)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                  zoomScale === scale
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>

          {/* Sync Scroll Toggle */}
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              syncScroll
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Synchronize scroll positions across both viewports"
          >
            {syncScroll ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Scroll Sync: ON</span>
              </>
            ) : (
              <>
                <Unlink2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Scroll Sync: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
