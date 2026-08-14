import React, { useState } from 'react';
import { DevicePreset } from '../types';
import { RefreshCw, ExternalLink, Sparkles } from 'lucide-react';

interface StackedViewProps {
  url1: string;
  url2: string;
  useProxy: boolean;
  selectedDevice: DevicePreset;
  refreshKey: number;
}

export const StackedView: React.FC<StackedViewProps> = ({
  url1,
  url2,
  useProxy,
  selectedDevice,
  refreshKey,
}) => {
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(0);

  const targetUrl1 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url1)}`
    : url1;
  const targetUrl2 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url2)}`
    : url2;

  const devWidth = selectedDevice.width > 0 ? `${selectedDevice.width}px` : '100%';

  return (
    <div className="flex-1 bg-slate-950 p-4 min-h-[calc(100vh-170px)] flex flex-col items-center gap-6">
      <div className="max-w-[1600px] w-full flex flex-col gap-6">
        {/* Top: Website 1 */}
        <div className="flex flex-col w-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                Website 1 (V1 - Original)
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">{url1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setKey1((k) => k + 1)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Reload V1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <a
                href={url1}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Open V1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="w-full flex justify-center bg-slate-950 p-3 min-h-[500px]">
            <div
              className="w-full h-[550px] bg-white rounded-lg overflow-hidden shadow-inner"
              style={{ maxWidth: devWidth }}
            >
              <iframe
                key={`stacked-v1-${key1}-${refreshKey}`}
                src={targetUrl1}
                className="w-full h-full border-0"
                title="Website 1 Stacked"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>

        {/* Bottom: Website 2 */}
        <div className="flex flex-col w-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase flex items-center gap-1.5">
                Website 2 (V2 - New Redesign) <Sparkles className="w-3 h-3 text-indigo-400" />
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">{url2}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setKey2((k) => k + 1)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Reload V2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <a
                href={url2}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Open V2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="w-full flex justify-center bg-slate-950 p-3 min-h-[500px]">
            <div
              className="w-full h-[550px] bg-white rounded-lg overflow-hidden shadow-inner"
              style={{ maxWidth: devWidth }}
            >
              <iframe
                key={`stacked-v2-${key2}-${refreshKey}`}
                src={targetUrl2}
                className="w-full h-full border-0"
                title="Website 2 Stacked"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
