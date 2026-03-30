'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthGate from '@/components/AuthGate';

export default function WritingTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const task = params.task as string;

  useEffect(() => {
    if (authLoading || !isLoggedIn) return;
    const taskNum = task === '1' ? 1 : 2;
    localStorage.setItem('celpip_ai_writing_prompt', JSON.stringify({
      task: taskNum,
      randomTheme: true,
    }));
    router.replace(taskNum === 1 ? '/writing/task-1' : '/writing/task-2');
  }, [task, router, isLoggedIn, authLoading]);

  if (!authLoading && !isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1117' }}>
        <AuthGate message="Sign up free to practice Writing with AI feedback!" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading writing exercise...</p>
    </div>
  );
}
