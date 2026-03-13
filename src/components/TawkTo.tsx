'use client';

import { useEffect } from 'react';

export default function TawkTo() {
  useEffect(() => {
    // @ts-ignore
    window.Tawk_API = window.Tawk_API || {};
    // @ts-ignore
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69b382abcdd3b51c3a6f53ca/1jjijcri2';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.head.appendChild(s1);

    return () => {
      // Cleanup on unmount
      try { document.head.removeChild(s1); } catch {}
    };
  }, []);

  return null;
}
