/**
 * GA4 Custom Events — centralized tracking helper
 * Uses the global gtag() loaded in layout.tsx (G-SD2516DCJM)
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params);
  }
}

export const analytics = {
  exerciseStart: (section: string, task: string) =>
    track('exercise_start', { section, task }),

  aiFeedbackRequest: (section: string) =>
    track('ai_feedback_request', { section }),

  mockExamStart: () =>
    track('mock_exam_start'),

  beginCheckout: (value = 8.25, currency = 'USD') =>
    track('begin_checkout', { value, currency }),

  viewPricing: () =>
    track('view_pricing'),

  purchase: (value: number, currency: string, transactionId: string) =>
    track('purchase', { value, currency, transaction_id: transactionId }),
};
