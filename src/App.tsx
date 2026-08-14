import React, { useState, useCallback } from 'react';
import { ViewMode, DevicePreset, SiteInspectData } from './types';
import { DEFAULT_SITE_1, DEFAULT_SITE_2, DEVICE_PRESETS } from './data';
import { Header } from './components/Header';
import { UrlBar } from './components/UrlBar';
import { Toolbar } from './components/Toolbar';
import { SideBySideView } from './components/SideBySideView';
import { SplitSliderView } from './components/SplitSliderView';
import { StackedView } from './components/StackedView';
import { FocusToggleView } from './components/FocusToggleView';
import { AuditMatrixView } from './components/AuditMatrixView';
import { NotesView } from './components/NotesView';

export default function App() {
  const [activeMode, setActiveMode] = useState<ViewMode>('side-by-side');
  const [url1, setUrl1] = useState<string>(DEFAULT_SITE_1);
  const [url2, setUrl2] = useState<string>(DEFAULT_SITE_2);
  const [useProxy, setUseProxy] = useState<boolean>(false); // Direct frame embed by default for standard sites
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]); // Fluid fit
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [splitRatio, setSplitRatio] = useState<'50-50' | '60-40' | '40-60'>('50-50');
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Inspect data state
  const [inspectData, setInspectData] = useState<{
    site1: SiteInspectData | null;
    site2: SiteInspectData | null;
  } | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  // Swap Left and Right URLs
  const handleSwapUrls = () => {
    const temp = url1;
    setUrl1(url2);
    setUrl2(temp);
    setRefreshKey((k) => k + 1);
  };

  // Reset to default Property Sample URLs
  const handleResetUrls = () => {
    setUrl1(DEFAULT_SITE_1);
    setUrl2(DEFAULT_SITE_2);
    setRefreshKey((k) => k + 1);
  };

  // Refresh both viewports
  const handleRefreshAll = () => {
    setRefreshKey((k) => k + 1);
  };

  // Run audit on both sites
  const handleInspectSites = useCallback(async () => {
    setIsInspecting(true);
    try {
      const res = await fetch(
        `/api/inspect?url1=${encodeURIComponent(url1)}&url2=${encodeURIComponent(url2)}`
      );
      if (res.ok) {
        const data = await res.json();
        setInspectData(data);
      } else {
        console.error('Audit failed:', await res.text());
      }
    } catch (err) {
      console.error('Failed to run audit:', err);
    } finally {
      setIsInspecting(false);
    }
  }, [url1, url2]);

  // Export comparison report as Markdown file
  const handleExportReport = () => {
    const reportText = `# Property Showcase Comparison Report

Generated on: ${new Date().toLocaleString()}

## Target Websites
- **Website 1 (V1 - Original):** ${url1}
- **Website 2 (V2 - New Redesign):** ${url2}

## Technical Audit Summary
${
  inspectData?.site1 && inspectData?.site2
    ? `- **V1 Load Speed:** ${inspectData.site1.loadTimeMs} ms (${inspectData.site1.htmlSizeKb} KB)
- **V2 Load Speed:** ${inspectData.site2.loadTimeMs} ms (${inspectData.site2.htmlSizeKb} KB)
- **V1 Document Title:** ${inspectData.site1.title}
- **V2 Document Title:** ${inspectData.site2.title}
- **V1 Headings:** ${inspectData.site1.h1Count} H1, ${inspectData.site1.h2Count} H2
- **V2 Headings:** ${inspectData.site2.h1Count} H1, ${inspectData.site2.h2Count} H2
- **V1 Image Assets:** ${inspectData.site1.imgCount}
- **V2 Image Assets:** ${inspectData.site2.imgCount}`
    : 'Run the Technical Audit Matrix in the dashboard for automated speed and DOM node counts.'
}

## Core Visual & UX Highlights
1. **Hero Section:** V2 presents refined headline contrast, updated font weights, and improved call-to-action button styling.
2. **Property Card Grid:** V2 enhances hover state micro-interactions, badge placement, and price formatting.
3. **Filter Bar:** Mobile-friendly responsive wrapping and clean inline icons in V2.
4. **Performance & Responsiveness:** Fluid scaling across wide desktop, laptop, tablet, and mobile viewports.

---
*Report generated via Property Showcase Comparison Tool*
`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `property-comparison-report-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onRefreshAll={handleRefreshAll}
        onExportReport={handleExportReport}
        onInspectSites={() => {
          setActiveMode('audit-matrix');
          handleInspectSites();
        }}
        isInspecting={isInspecting}
      />

      {/* URL Inputs Bar */}
      <UrlBar
        url1={url1}
        setUrl1={setUrl1}
        url2={url2}
        setUrl2={setUrl2}
        useProxy={useProxy}
        setUseProxy={setUseProxy}
        onSwap={handleSwapUrls}
        onReset={handleResetUrls}
      />

      {/* Viewport Toolbar (Only shown when viewing iframe layout modes) */}
      {['side-by-side', 'split-slider', 'stacked', 'focus-toggle'].includes(activeMode) && (
        <Toolbar
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          isPortrait={isPortrait}
          setIsPortrait={setIsPortrait}
          zoomScale={zoomScale}
          setZoomScale={setZoomScale}
          splitRatio={splitRatio}
          setSplitRatio={setSplitRatio}
          syncScroll={syncScroll}
          setSyncScroll={setSyncScroll}
        />
      )}

      {/* Main View Mode Content */}
      <main className="flex-1 flex flex-col">
        {activeMode === 'side-by-side' && (
          <SideBySideView
            url1={url1}
            url2={url2}
            useProxy={useProxy}
            selectedDevice={selectedDevice}
            isPortrait={isPortrait}
            zoomScale={zoomScale}
            splitRatio={splitRatio}
            syncScroll={syncScroll}
            refreshKey={refreshKey}
          />
        )}

        {activeMode === 'split-slider' && (
          <SplitSliderView
            url1={url1}
            url2={url2}
            useProxy={useProxy}
            selectedDevice={selectedDevice}
            zoomScale={zoomScale}
            refreshKey={refreshKey}
          />
        )}

        {activeMode === 'stacked' && (
          <StackedView
            url1={url1}
            url2={url2}
            useProxy={useProxy}
            selectedDevice={selectedDevice}
            refreshKey={refreshKey}
          />
        )}

        {activeMode === 'focus-toggle' && (
          <FocusToggleView
            url1={url1}
            url2={url2}
            useProxy={useProxy}
            selectedDevice={selectedDevice}
            refreshKey={refreshKey}
          />
        )}

        {activeMode === 'audit-matrix' && (
          <AuditMatrixView
            url1={url1}
            url2={url2}
            inspectData={inspectData}
            isInspecting={isInspecting}
            onRunAudit={handleInspectSites}
          />
        )}

        {activeMode === 'notes' && (
          <NotesView onExportReport={handleExportReport} />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-3 text-center text-xs text-slate-500">
        Comparing <span className="text-emerald-400 font-semibold font-mono">{url1}</span> with{' '}
        <span className="text-indigo-400 font-semibold font-mono">{url2}</span>
      </footer>
    </div>
  );
}
