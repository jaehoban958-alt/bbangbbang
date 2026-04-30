import { BADGE_RARITIES, BADGE_POOL, LEVEL_THRESHOLDS, LEVEL_LABELS } from './appData';
import type { EarnedBadge } from '../types';

export function generateSpaceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function buildCalendarGrid(year: number, month: number): Array<Date | null> {
  const firstDay = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const grid: Array<Date | null> = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export function isFemaleRangeDay(date: Date, rangeStart: string | null): boolean {
  if (!rangeStart) return false;
  const start = new Date(rangeStart);
  const end   = new Date(rangeStart);
  end.setDate(end.getDate() + 6);
  const d = new Date(toISODate(date));
  return d >= start && d <= end;
}

export function rollBadge(): EarnedBadge {
  const totalWeight = BADGE_RARITIES.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * totalWeight;
  let rarity = BADGE_RARITIES[0];
  for (const r of BADGE_RARITIES) {
    rand -= r.weight;
    if (rand <= 0) { rarity = r; break; }
  }
  const badge = BADGE_POOL[Math.floor(Math.random() * BADGE_POOL.length)];
  return {
    key:      `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    id:       badge.id,
    label:    badge.label,
    emoji:    badge.emoji,
    rarity:   rarity.id,
    count:    1,
    earnedAt: todayISO(),
  };
}

export function getLevel(total: number): { level: number; label: string; progress: number; next: number } {
  let level = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (total >= LEVEL_THRESHOLDS[i]) { level = i; break; }
  }
  const current = LEVEL_THRESHOLDS[level];
  const next    = LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)];
  const progress = next === current ? 100 : Math.round(((total - current) / (next - current)) * 100);
  return { level: level + 1, label: LEVEL_LABELS[level], progress, next };
}

export function compressImage(file: File, maxPx = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function generateCouponId(): string {
  return `coupon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
