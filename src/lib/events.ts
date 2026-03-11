// Site-wide promotional events configuration
export interface SiteEvent {
  id: string;
  name: string;
  description: string;
  discount: string;        // e.g. "50% OFF"
  promoCode: string;       // Stripe promo code
  startDate: string;       // ISO date
  endDate: string;         // ISO date
  bannerEmoji: string;
  bannerColor: string;     // gradient start
  bannerColorEnd: string;  // gradient end
  ctaText: string;
}

// ══════════════════════════════════════════
// 🎉 ACTIVE EVENTS — edit here to manage
// ══════════════════════════════════════════
export const SITE_EVENTS: SiteEvent[] = [
  {
    id: 'welcome-30-2026',
    name: 'Welcome Offer',
    description: 'Get 30% OFF your first month — monthly plan only!',
    discount: '30% OFF',
    promoCode: 'WELCOME30',
    startDate: '2026-03-08T00:00:00Z',
    endDate: '2026-03-16T23:59:59Z',
    bannerEmoji: '🎉',
    bannerColor: '#7c3aed',
    bannerColorEnd: '#db2777',
    ctaText: 'Claim 30% OFF',
  },
];

export function getActiveEvent(): SiteEvent | null {
  const now = new Date();
  return SITE_EVENTS.find(e => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    return now >= start && now <= end;
  }) || null;
}

export function getTimeRemaining(endDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}
