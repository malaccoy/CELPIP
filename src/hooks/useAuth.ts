'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<any>(undefined); // undefined = loading, null = no user

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    }).catch(() => setUser(null));
  }, []);

  return { user, loading: user === undefined, isLoggedIn: !!user };
}
