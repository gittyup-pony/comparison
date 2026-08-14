import { DevicePreset, ReviewItem } from './types';

export const DEFAULT_SITE_1 = 'https://property-sample.vercel.app/';
export const DEFAULT_SITE_2 = 'https://property-sample-new.vercel.app/';

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'fluid', name: 'Fluid Fit', width: 0, height: 0, icon: 'responsive' },
  { id: 'desktop-wide', name: '4K / Wide Desktop', width: 1920, height: 1080, icon: 'desktop' },
  { id: 'desktop-std', name: 'Standard Desktop', width: 1440, height: 900, icon: 'desktop' },
  { id: 'laptop', name: 'Laptop (13")', width: 1280, height: 800, icon: 'laptop' },
  { id: 'tablet', name: 'Tablet (iPad)', width: 768, height: 1024, icon: 'tablet' },
  { id: 'mobile-large', name: 'Mobile Pro (iPhone)', width: 430, height: 932, icon: 'smartphone' },
  { id: 'mobile-small', name: 'Mobile Compact', width: 375, height: 812, icon: 'smartphone' },
];

export const INITIAL_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: 'rev-1',
    category: 'Hero & Banner',
    feature: 'Hero Header & Headline',
    v1Description: 'Standard property showcase banner with original layout and imagery',
    v2Description: 'Updated typography, refreshed hero headline contrast, and refined call-to-action buttons',
    status: 'Improved',
    rating: 5,
    notes: 'V2 features cleaner contrast and higher resolution background elements.'
  },
  {
    id: 'rev-2',
    category: 'Listing Grid',
    feature: 'Property Cards Layout',
    v1Description: 'Classic card grid with price badges and standard card padding',
    v2Description: 'Enhanced card hover states, micro-interactions, badge alignments, and price formatting',
    status: 'Redesigned',
    rating: 5,
    notes: 'The new design improves visual hierarchy and property detail visibility.'
  },
  {
    id: 'rev-3',
    category: 'Search & Filters',
    feature: 'Property Search Bar',
    v1Description: 'Basic search bar with location and type filters',
    v2Description: 'Streamlined input fields with inline icons and improved responsive wrapping',
    status: 'Improved',
    rating: 4,
    notes: 'Much easier to filter properties on mobile and tablet screens in V2.'
  },
  {
    id: 'rev-4',
    category: 'Typography & Colors',
    feature: 'Color Palette & Hierarchy',
    v1Description: 'Standard neutral scheme',
    v2Description: 'Updated accent palette, improved font weight hierarchy, and cleaner line spacing',
    status: 'Improved',
    rating: 5,
    notes: 'Typography in V2 feels much more high-end and premium.'
  },
  {
    id: 'rev-5',
    category: 'Performance & UX',
    feature: 'Page Load & Asset Handling',
    v1Description: 'Baseline production build on Vercel',
    v2Description: 'Optimized build with updated image pipeline and faster layout shift',
    status: 'Improved',
    rating: 4,
    notes: 'V2 renders quickly and transitions between states smoothly.'
  }
];
