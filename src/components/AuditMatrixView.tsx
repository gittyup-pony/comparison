import React, { useEffect, useState } from 'react';
import { SiteInspectData } from '../types';
import { 
  BarChart3, 
  Sparkles, 
  Clock, 
  HardDrive, 
  Heading, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Code, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';

interface AuditMatrixViewProps {
  url1: string;
  url2: string;
  inspectData: { site1: SiteInspectData | null; site2: SiteInspectData | null } | null;
  isInspecting: boolean;
  onRunAudit: () => void;
}

export const AuditMatrixView: React.FC<AuditMatrixViewProps> = ({
  url1,
  url2,
  inspectData,
  isInspecting,
  onRunAudit,
}) => {
  useEffect(() => {
    if (!inspectData && !isInspecting) {
      onRunAudit();
    }
  }, [inspectData, isInspecting]);

  const s1 = inspectData?.site1;
  const s2 = inspectData?.site2;

  const compareNumber = (val1: number, val2: number, invertBetter = false) => {
    const diff = val2 - val1;
    if (diff === 0) return <span className="text-slate-400 font-mono text-xs">Same</span>;
    const isPositiveGood = invertBetter ? diff < 0 : diff > 0;
    const sign = diff > 0 ? `+${diff}` : `${diff}`;
    return (
      <span className={`font-mono text-xs font-bold ${isPositiveGood ? 'text-emerald-400' : 'text-amber-400'}`}>
        {sign}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 md:p-6 min-h-[calc(100vh-170px)] flex flex-col items-center">
      <div className="max-w-[1400px] w-full flex flex-col gap-6">
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Technical & Structural Audit Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Automated document analysis comparing SEO, DOM node density, media assets, and response timing.
              </p>
            </div>
          </div>

          <button
            onClick={onRunAudit}
            disabled={isInspecting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isInspecting ? 'animate-spin' : ''}`} />
            <span>{isInspecting ? 'Analyzing Pages...' : 'Re-run Audit'}</span>
          </button>
        </div>

        {/* Audit Content Grid */}
        {isInspecting ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-center">
            <Zap className="w-10 h-10 text-indigo-400 animate-bounce" />
            <h3 className="text-base font-bold text-white">Auditing Both Property Sites</h3>
            <p className="text-xs text-slate-400 max-w-md">
              Fetching page documents, parsing head metadata, counting element tags, and measuring response metrics...
            </p>
          </div>
        ) : !s1 || !s2 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            Click "Re-run Audit" above to compare page structures.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Metric Comparison Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Load Speed */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-indigo-400" /> Response Time
                  </span>
                  {compareNumber(s1.loadTimeMs, s2.loadTimeMs, true)}
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">V1 (Original)</span>
                    <span className="text-lg font-bold font-mono text-slate-200">{s1.loadTimeMs} ms</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-400 block">V2 (Redesign)</span>
                    <span className="text-lg font-bold font-mono text-indigo-300">{s2.loadTimeMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Document Size */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <HardDrive className="w-4 h-4 text-emerald-400" /> HTML Document Size
                  </span>
                  {compareNumber(s1.htmlSizeKb, s2.htmlSizeKb, true)}
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">V1 (Original)</span>
                    <span className="text-lg font-bold font-mono text-slate-200">{s1.htmlSizeKb} KB</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-400 block">V2 (Redesign)</span>
                    <span className="text-lg font-bold font-mono text-indigo-300">{s2.htmlSizeKb} KB</span>
                  </div>
                </div>
              </div>

              {/* Image Asset Count */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ImageIcon className="w-4 h-4 text-amber-400" /> Image Elements
                  </span>
                  {compareNumber(s1.imgCount, s2.imgCount)}
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">V1 (Original)</span>
                    <span className="text-lg font-bold font-mono text-slate-200">{s1.imgCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-400 block">V2 (Redesign)</span>
                    <span className="text-lg font-bold font-mono text-indigo-300">{s2.imgCount}</span>
                  </div>
                </div>
              </div>

              {/* Links Count */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <LinkIcon className="w-4 h-4 text-sky-400" /> Anchor Links
                  </span>
                  {compareNumber(s1.linkCount, s2.linkCount)}
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">V1 (Original)</span>
                    <span className="text-lg font-bold font-mono text-slate-200">{s1.linkCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-indigo-400 block">V2 (Redesign)</span>
                    <span className="text-lg font-bold font-mono text-indigo-300">{s2.linkCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" /> Detailed Page Specifications
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-6 w-1/4">Specification</th>
                      <th className="py-3 px-6 w-3/8 text-emerald-400">Website 1 (V1)</th>
                      <th className="py-3 px-6 w-3/8 text-indigo-400">Website 2 (V2)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {/* Status */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-medium text-slate-400">HTTP Status</td>
                      <td className="py-3.5 px-6 font-mono text-emerald-400 font-bold">{s1.status} OK</td>
                      <td className="py-3.5 px-6 font-mono text-indigo-400 font-bold">{s2.status} OK</td>
                    </tr>

                    {/* Page Title */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-medium text-slate-400">Document Title</td>
                      <td className="py-3.5 px-6 font-medium text-slate-200">{s1.title}</td>
                      <td className="py-3.5 px-6 font-medium text-slate-200">{s2.title}</td>
                    </tr>

                    {/* Meta Description */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-medium text-slate-400">Meta Description</td>
                      <td className="py-3.5 px-6 text-slate-300 italic">{s1.description}</td>
                      <td className="py-3.5 px-6 text-slate-300 italic">{s2.description}</td>
                    </tr>

                    {/* Headings Tree */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-medium text-slate-400">Heading Nodes (H1/H2/H3)</td>
                      <td className="py-3.5 px-6 font-mono">
                        <span className="text-emerald-400 font-bold">{s1.h1Count} H1</span> / {s1.h2Count} H2 / {s1.h3Count} H3
                      </td>
                      <td className="py-3.5 px-6 font-mono">
                        <span className="text-indigo-400 font-bold">{s2.h1Count} H1</span> / {s2.h2Count} H2 / {s2.h3Count} H3
                      </td>
                    </tr>

                    {/* H1 Headings list */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-medium text-slate-400">H1 Header Text</td>
                      <td className="py-3.5 px-6 text-slate-300">
                        {s1.h1List.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {s1.h1List.map((h, i) => (
                              <li key={i} className="truncate max-w-xs">{h}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-500">None detected</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-slate-300">
                        {s2.h1List.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {s2.h1List.map((h, i) => (
                              <li key={i} className="truncate max-w-xs">{h}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-500">None detected</span>
                        )}
                      </td>
                    </tr>

                    {/* Scripts & Stylesheets */}
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-medium text-slate-400">Scripts & Stylesheets</td>
                      <td className="py-3.5 px-6 font-mono text-slate-300">
                        {s1.scriptCount} Scripts / {s1.styleCount} CSS Links
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-300">
                        {s2.scriptCount} Scripts / {s2.styleCount} CSS Links
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
