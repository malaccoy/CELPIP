'use client';

// Guest mode disabled — login required for drills
export function useGuest() {
  return {
    isGuest: false,
    guestCount: 0,
    guestBlocked: false,
    incrementGuest: () => 0,
    checkDone: true,
    GUEST_LIMIT: 0,
    showWall: false,
    setShowWall: () => {},
    guardAction: () => false,
    trackExercise: () => {},
  };
}
