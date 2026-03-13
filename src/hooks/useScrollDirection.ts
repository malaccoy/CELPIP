'use client';

import { useState, useEffect, useRef } from 'react';

export function useScrollDirection(threshold = 10) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 56) {
        setHidden(false);
      } else if (currentY - lastScrollY.current > threshold) {
        setHidden(true); // scrolling down
      } else if (lastScrollY.current - currentY > threshold) {
        setHidden(false); // scrolling up
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hidden;
}
