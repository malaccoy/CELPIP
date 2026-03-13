// Google Analytics 4 custom event tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Pre-defined events
export const analytics = {
  // Navigation
  clickPractice: (skill?: string) => trackEvent('click_practice', { skill }),
  clickCitizenship: () => trackEvent('click_citizenship'),
  clickPricing: () => trackEvent('click_pricing'),
  clickCommunity: () => trackEvent('click_community'),
  clickBlog: () => trackEvent('click_blog'),

  // Practice funnel
  exerciseStart: (skill: string, part?: string) =>
    trackEvent('exercise_start', { skill, part }),
  exerciseStarted: (skill: string, part?: string, difficulty?: string) =>
    trackEvent('exercise_started', { skill, part, difficulty }),
  exerciseCompleted: (skill: string, score?: number, timeSeconds?: number) =>
    trackEvent('exercise_completed', { skill, score, time_seconds: timeSeconds }),
  aiFeedbackRequest: (skill: string) =>
    trackEvent('ai_feedback_request', { skill }),
  mockExamStarted: (mode: string) => trackEvent('mock_exam_started', { mode }),
  mockExamCompleted: (mode: string, score?: number) =>
    trackEvent('mock_exam_completed', { mode, score }),

  // Citizenship
  lessonStarted: (lessonId: number, title?: string) =>
    trackEvent('lesson_started', { lesson_id: lessonId, title }),
  lessonCompleted: (lessonId: number, score?: number) =>
    trackEvent('lesson_completed', { lesson_id: lessonId, score }),

  // Conversion funnel
  upgradeModalShown: (trigger?: string) => trackEvent('upgrade_modal_shown', { trigger }),
  upgradeClicked: (plan?: string, source?: string) =>
    trackEvent('upgrade_clicked', { plan, source }),
  communityPopupShown: () => trackEvent('community_popup_shown'),
  communityJoined: () => trackEvent('community_joined'),

  // Auth
  signupStarted: () => trackEvent('signup_started'),
  signupCompleted: () => trackEvent('signup_completed'),
  loginCompleted: () => trackEvent('login_completed'),

  // Pricing/Purchase (GA4 ecommerce)
  viewPricing: () => trackEvent('view_pricing'),
  beginCheckout: (value?: number, currency?: string) =>
    trackEvent('begin_checkout', { value, currency }),
  purchase: (value?: number, currency?: string, source?: string) =>
    trackEvent('purchase', { value, currency, source }),
};
