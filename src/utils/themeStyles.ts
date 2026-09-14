import { ThemeColor } from '../types/invoice';

export interface ThemePalette {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
  headerText: string;
  accentText: string;
  borderAccent: string;
  subtleBg: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  brandDot: string;
}

export const THEME_PALETTES: Record<ThemeColor, ThemePalette> = {
  indigo: {
    name: 'Indigo Modern',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    headerBg: 'bg-indigo-600',
    headerText: 'text-white',
    accentText: 'text-indigo-600',
    borderAccent: 'border-indigo-500',
    subtleBg: 'bg-indigo-50/70',
    tableHeaderBg: 'bg-indigo-50/80',
    tableHeaderText: 'text-indigo-900',
    brandDot: 'bg-indigo-600',
  },
  emerald: {
    name: 'Emerald Forest',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    headerBg: 'bg-emerald-600',
    headerText: 'text-white',
    accentText: 'text-emerald-600',
    borderAccent: 'border-emerald-500',
    subtleBg: 'bg-emerald-50/70',
    tableHeaderBg: 'bg-emerald-50/80',
    tableHeaderText: 'text-emerald-900',
    brandDot: 'bg-emerald-600',
  },
  blue: {
    name: 'Corporate Blue',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    headerBg: 'bg-blue-600',
    headerText: 'text-white',
    accentText: 'text-blue-600',
    borderAccent: 'border-blue-500',
    subtleBg: 'bg-blue-50/70',
    tableHeaderBg: 'bg-blue-50/80',
    tableHeaderText: 'text-blue-900',
    brandDot: 'bg-blue-600',
  },
  slate: {
    name: 'Monochrome Slate',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
    headerBg: 'bg-slate-800',
    headerText: 'text-white',
    accentText: 'text-slate-800',
    borderAccent: 'border-slate-700',
    subtleBg: 'bg-slate-50',
    tableHeaderBg: 'bg-slate-100',
    tableHeaderText: 'text-slate-900',
    brandDot: 'bg-slate-800',
  },
  violet: {
    name: 'Royal Violet',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    badgeBorder: 'border-violet-200',
    headerBg: 'bg-violet-600',
    headerText: 'text-white',
    accentText: 'text-violet-600',
    borderAccent: 'border-violet-500',
    subtleBg: 'bg-violet-50/70',
    tableHeaderBg: 'bg-violet-50/80',
    tableHeaderText: 'text-violet-900',
    brandDot: 'bg-violet-600',
  },
  rose: {
    name: 'Warm Rose',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    headerBg: 'bg-rose-600',
    headerText: 'text-white',
    accentText: 'text-rose-600',
    borderAccent: 'border-rose-500',
    subtleBg: 'bg-rose-50/70',
    tableHeaderBg: 'bg-rose-50/80',
    tableHeaderText: 'text-rose-900',
    brandDot: 'bg-rose-600',
  },
  amber: {
    name: 'Executive Amber',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    headerBg: 'bg-amber-700',
    headerText: 'text-white',
    accentText: 'text-amber-700',
    borderAccent: 'border-amber-600',
    subtleBg: 'bg-amber-50/70',
    tableHeaderBg: 'bg-amber-50/80',
    tableHeaderText: 'text-amber-900',
    brandDot: 'bg-amber-600',
  },
};
