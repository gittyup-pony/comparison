export type ViewMode = 'side-by-side' | 'split-slider' | 'stacked' | 'focus-toggle' | 'audit-matrix' | 'notes';

export type DevicePreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: 'desktop' | 'laptop' | 'tablet' | 'smartphone' | 'responsive';
};

export interface SiteConfig {
  id: 'site1' | 'site2';
  title: string;
  url: string;
  badge: string;
  badgeColor: string;
}

export interface SiteInspectData {
  url: string;
  status: number;
  ok: boolean;
  loadTimeMs: number;
  htmlSizeKb: number;
  title: string;
  description: string;
  ogTitle: string | null;
  ogImage: string | null;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  imgCount: number;
  linkCount: number;
  scriptCount: number;
  styleCount: number;
  hasDarkMode: boolean;
  hasTailwind: boolean;
  h1List: string[];
  error?: boolean;
}

export interface ReviewItem {
  id: string;
  category: 'Hero & Banner' | 'Listing Grid' | 'Search & Filters' | 'Typography & Colors' | 'Navigation & Footer' | 'Performance & UX';
  feature: string;
  v1Description: string;
  v2Description: string;
  status: 'Improved' | 'Redesigned' | 'Unchanged' | 'Needs Work';
  rating: number; // 1 to 5
  notes: string;
}
