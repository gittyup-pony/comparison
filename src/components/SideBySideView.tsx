import React, { useRef, useState, useEffect } from 'react';
import { DevicePreset } from '../types';
import { 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  Maximize2, 
  Globe, 
  Loader2,
  Sparkles
} from 'lucide-react';

interface SideBySideViewProps {
  url1: string;
  url2: string;
  useProxy: boolean;
  selectedDevice: DevicePreset;
  isPortrait: boolean;
  zoomScale: number;
  splitRatio: '50-50' | '60-40' | '40-60';
  syncScroll: boolean;
  refreshKey: number;
}

export const SideBySideView: React.FC<SideBySideViewProps> = ({
  url1,
  url2,
  useProxy,
  selectedDevice,
  isPortrait,
  zoomScale,
  splitRatio,
  syncScroll,
  refreshKey,
}) => {
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(0);

  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  // Compute actual target URLs (Direct or Anti-Block Proxy)
  const targetUrl1 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url1)}`
    : url1;
  const targetUrl2 = useProxy
    ? `/api/proxy?url=${encodeURIComponent(url2)}`
    : url2;

  // Handle reload triggered by top-level refreshKey
  useEffect(() => {
    setKey1((k) => k + 1);
    setKey2((k) => k + 1);
    setLoading1(true);
    setLoading2(true);
  }, [refreshKey, url1, url2, useProxy]);

  // Synchronized scroll logic between containers
  const handleScroll = (source: 'left' | 'right') => {
    if (!syncScroll || isSyncingRef.current) return;
    isSyncingRef.current = true;

    const sourceEl = source === 'left' ? containerRef1.current : containerRef2.current;
    const targetEl = source === 'left' ? containerRef2.current : containerRef1.current;

    if (sourceEl && targetEl) {
      const scrollPercentage =
        sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight || 1);
      targetEl.scrollTop =
        scrollPercentage * (targetEl.scrollHeight - targetEl.clientHeight);
    }

    setTimeout(() => {
      isSyncingRef.current = false;
    }, 50);
  };

  const copyUrl = (url: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine width ratio classes
  const getRatioClasses = () => {
    switch (splitRatio) {
      case '60-40':
        return { left: 'w-full lg:w-[60%]', right: 'w-full lg:w-[40%]' };
      case '40-60':
        return { left: 'w-full lg:w-[40%]', right: 'w-full lg:w-[60%]' };
      default:
        return { left: 'w-full lg:w-[50%]', right: 'w-full lg:w-[50%]' };
    }
  };

  const ratioClasses = getRatioClasses();

  // Compute dimensions if device preset is chosen
  let devWidth = selectedDevice.width;
  let devHeight = selectedDevice.height;

  if (devWidth > 0 && isPortrait) {
    // Swap width and height for portrait orientation
    const temp = devWidth;
    devWidth = devHeight || 800;
    devHeight = temp;
  }

  return (
    <div className="flex-1 bg-slate-950 p-4 min-h-[calc(100vh-170px)] flex flex-col justify-center">
      <div className="max-w-[1800px] mx-auto w-full flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Side: Website 1 */}
        <div className={`${ratioClasses.left} flex flex-col transition-all duration-300`}>
          {/* Frame Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                Website 1 (V1)
              </span>
              <span className="text-[11px] text-slate-400 font-mono truncate hidden sm:inline max-w-[200px]">
                {url1}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setKey1((k) => k + 1);
                  setLoading1(true);
                }}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Reload Website 1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading1 ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
              <button
                onClick={() => copyUrl(url1, setCopied1)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copied1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={url1}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Iframe Viewport Wrapper */}
          <div className="bg-slate-900/80 border-x border-b border-slate-800 rounded-b-xl flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden min-h-[600px]">
            {loading1 && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs font-medium text-slate-300">Loading Property V1...</p>
              </div>
            )}

            <div
              ref={containerRef1}
              onScroll={() => handleScroll('left')}
              className="w-full flex-1 flex justify-center items-start overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent rounded-lg"
              style={{
                maxHeight: devHeight ? `${devHeight * zoomScale + 40}px` : '750px',
              }}
            >
              <div
                className="transition-all duration-200 bg-white shadow-2xl rounded-lg overflow-hidden relative"
                style={{
                  width: devWidth > 0 ? `${devWidth}px` : '100%',
                  height: devHeight > 0 ? `${devHeight}px` : '700px',
                  transform: zoomScale !== 1 ? `scale(${zoomScale})` : 'none',
                  transformOrigin: 'top center',
                }}
              >
                <iframe
                  key={key1}
                  src={targetUrl1}
                  onLoad={() => setLoading1(false)}
                  className="w-full h-full border-0"
                  title="Website 1 Frame"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Website 2 */}
        <div className={`${ratioClasses.right} flex flex-col transition-all duration-300`}>
          {/* Frame Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase flex items-center gap-1.5">
                Website 2 (V2) <Sparkles className="w-3 h-3 text-indigo-400" />
              </span>
              <span className="text-[11px] text-slate-400 font-mono truncate hidden sm:inline max-w-[200px]">
                {url2}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setKey2((k) => k + 1);
                  setLoading2(true);
                }}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Reload Website 2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading2 ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
              <button
                onClick={() => copyUrl(url2, setCopied2)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Copy URL"
              >
                {copied2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={url2}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Iframe Viewport Wrapper */}
          <div className="bg-slate-900/80 border-x border-b border-slate-800 rounded-b-xl flex-1 flex flex-col items-center justify-center p-3 relative overflow-hidden min-h-[600px]">
            {loading2 && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs font-medium text-slate-300">Loading Property V2...</p>
              </div>
            )}

            <div
              ref={containerRef2}
              onScroll={() => handleScroll('right')}
              className="w-full flex-1 flex justify-center items-start overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent rounded-lg"
              style={{
                maxHeight: devHeight ? `${devHeight * zoomScale + 40}px` : '750px',
              }}
            >
              <div
                className="transition-all duration-200 bg-white shadow-2xl rounded-lg overflow-hidden relative"
                style={{
                  width: devWidth > 0 ? `${devWidth}px` : '100%',
                  height: devHeight > 0 ? `${devHeight}px` : '700px',
                  transform: zoomScale !== 1 ? `scale(${zoomScale})` : 'none',
                  transformOrigin: 'top center',
                }}
              >
                <iframe
                  key={key2}
                  src={targetUrl2}
                  onLoad={() => setLoading2(false)}
                  className="w-full h-full border-0"
                  title="Website 2 Frame"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
