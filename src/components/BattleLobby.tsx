'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { Users, Link2, Loader2, Copy, Check, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';


const T = {
  bg: '#0a0e1a', surface: '#141828', border: '#1e2540', green: '#22c55e',
  blue: '#3b82f6', orange: '#fb923c', gold: '#fbbf24', text: '#f1f5f9',
  textMuted: '#94a3b8', textSoft: '#64748b', purple: '#a855f7', red: '#ef4444',
  teal: '#14b8a6',
};

export default function BattleLobby() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Player');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
        setUserName(data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Player');
        setUserAvatar(data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null);
      }
      setAuthLoading(false);
    });
  }, []);

  const {
    connected, state, roomCode, players, question, scores, correctAnswer,
    finalResult, error, countdown,
    joinQueue, leaveQueue, createRoom, joinRoom, sendAnswer, reset
  } = useBattleSocket(userId, userName, userAvatar);

  const [joinCode, setJoinCode] = useState('');

  // Fetch battle leaderboard
  useEffect(() => {
    fetch('/api/battle-stats').then(r => r.json()).then(d => {
      setLeaderboard(d.leaderboard || []);
      setLbLoading(false);
    }).catch(() => setLbLoading(false));
  }, [state]);
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSent, setAnswerSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [scorePopup, setScorePopup] = useState<{show: boolean, text: string, color: string}>({show: false, text: '', color: ''});
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-submit on timeout (only when timer actually counted down to 0)
  const timerStartedRef = useRef(false);

  // Timer for questions
  useEffect(() => {
    if (state !== 'playing' || !question) return;
    timerStartedRef.current = false;
    setRoundStartTime(Date.now());
    setSelectedAnswer(null);
    setAnswerSent(false);
    setShowConfetti(false);
    setShakeWrong(false);
    setScorePopup({show: false, text: '', color: ''});
    // Small delay to let React settle before starting timer
    const startDelay = setTimeout(() => {
      setTimeLeft(Math.ceil(question.timeMs / 1000));
      timerStartedRef.current = true;
    }, 100);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { clearTimeout(startDelay); clearInterval(interval); };
  }, [state, question]);

  // Animation triggers on round end
  useEffect(() => {
    if (state !== 'round-end' || correctAnswer === null || !userId) return;
    const wasCorrect = selectedAnswer === correctAnswer;
    if (wasCorrect) {
      setShowConfetti(true);
      setScorePopup({show: true, text: '✓ Correct!', color: T.green});
    } else {
      setShakeWrong(true);
      setScorePopup({show: true, text: '✗ Wrong', color: T.red});
      setTimeout(() => setShakeWrong(false), 500);
    }
    setTimeout(() => setScorePopup({show: false, text: '', color: ''}), 2000);
  }, [state, correctAnswer]);

  // Auto-submit on timeout
  useEffect(() => {
    if (timeLeft === 0 && state === 'playing' && !answerSent && timerStartedRef.current) {
      sendAnswer(selectedAnswer, question?.timeMs || 15000);
      setAnswerSent(true);
    }
  }, [timeLeft, state, answerSent]);

    const handleAnswer = (idx: number) => {
    if (answerSent) return;
    setSelectedAnswer(idx);
    const elapsed = Date.now() - roundStartTime;
    sendAnswer(idx, elapsed);
    setAnswerSent(true);
  };

  const copyCode = () => {
    if (!roomCode) return;
    const url = `https://celpipaicoach.com/battle?join=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-join from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('join');
    if (code && connected && state === 'idle') {
      joinRoom(code);
    }
  }, [connected, state]);

  // League system
  const getLeague = (pts: number) => {
    if (pts >= 1000) return { name: 'Challenger', emoji: '👑', color: '#ff4444', bg: 'linear-gradient(135deg, #ff4444, #cc0000)' };
    if (pts >= 700) return { name: 'Grand Master', emoji: '🔮', color: '#e879f9', bg: 'linear-gradient(135deg, #e879f9, #a855f7)' };
    if (pts >= 500) return { name: 'Master', emoji: '🏅', color: '#f472b6', bg: 'linear-gradient(135deg, #f472b6, #ec4899)' };
    if (pts >= 400) return { name: 'Diamond', emoji: '💎', color: '#67e8f9', bg: 'linear-gradient(135deg, #67e8f9, #06b6d4)' };
    if (pts >= 300) return { name: 'Platinum', emoji: '⚡', color: '#a5f3fc', bg: 'linear-gradient(135deg, #a5f3fc, #22d3ee)' };
    if (pts >= 200) return { name: 'Gold', emoji: '🥇', color: '#fbbf24', bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)' };
    if (pts >= 100) return { name: 'Silver', emoji: '🥈', color: '#94a3b8', bg: 'linear-gradient(135deg, #94a3b8, #64748b)' };
    return { name: 'Bronze', emoji: '🥉', color: '#d97706', bg: 'linear-gradient(135deg, #d97706, #92400e)' };
  };
  const getNextLeague = (pts: number) => {
    const thresholds = [100, 200, 300, 400, 500, 700, 1000];
    const next = thresholds.find(t => t > pts);
    return next ? { pts: next, remaining: next - pts } : null;
  };

  // Avatar helper
  const Avatar = ({ src, name, size = 36, border }: { src?: string | null, name?: string, size?: number, border?: string }) => (
    src ? (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
        border: border || '2px solid ' + T.border,
      }} />
    ) : (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: T.border, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.4, fontWeight: 700, color: T.text,
        border: border || '2px solid ' + T.border,
      }}>
        {(name || 'P').charAt(0).toUpperCase()}
      </div>
    )
  );

  if (authLoading) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color={T.blue} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: T.surface, borderRadius: 16, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <span style={{ fontSize: 48 }}>⚔️</span>
          <h2 style={{ color: T.text, margin: '16px 0 8px', fontSize: 24 }}>CELPIP Battle</h2>
          <p style={{ color: T.textMuted, marginBottom: 24 }}>Sign in to battle other students!</p>
          <button onClick={() => router.push('/auth/login?redirect=/battle')}
            style={{ background: T.blue, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // ─── FINISHED ───
  if (state === 'finished') {
    const myScore = scores[userId!];
    const opponentId = Object.keys(scores).find(id => id !== userId);
    const opScore = opponentId ? scores[opponentId] : null;
    const isWinner = myScore?.isWinner;
    const isDraw = finalResult?.draw;
    const isForfeit = finalResult?.forfeit;

    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: T.surface, borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>
            {isForfeit ? '🏃' : isDraw ? '🤝' : isWinner ? '🏆' : '😔'}
          </div>
          <h2 style={{ color: isWinner ? T.gold : isDraw ? T.blue : T.red, fontSize: 28, margin: '0 0 4px', fontWeight: 800 }}>
            {isForfeit ? 'Opponent Left!' : isDraw ? 'Draw!' : isWinner ? 'You Win!' : 'You Lose!'}
          </h2>
          {!isForfeit && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '24px 0', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Avatar src={userAvatar} name={userName} size={48} border={`3px solid ${T.green}`} />
                <div style={{ color: T.textMuted, fontSize: 13 }}>You</div>
                <div style={{ color: T.green, fontSize: 36, fontWeight: 800 }}>{myScore?.score || 0}</div>
              </div>
              <div style={{ color: T.textSoft, fontSize: 24 }}>vs</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Avatar src={opScore?.avatar} name={opScore?.name} size={48} border={`3px solid ${T.orange}`} />
                <div style={{ color: T.textMuted, fontSize: 13 }}>{opScore?.name || 'Opponent'}</div>
                <div style={{ color: T.orange, fontSize: 36, fontWeight: 800 }}>{opScore?.score || 0}</div>
              </div>
            </div>
          )}
          <button onClick={reset}
            style={{ background: T.blue, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // ─── PLAYING / ROUND END ───
  if (state === 'playing' || state === 'round-end') {
    const q = question!;
    const myId = userId!;
    const myScore = scores[myId]?.score ?? 0;
    const opId = Object.keys(scores).find(id => id !== myId);
    const opScore = opId ? (scores[opId]?.score ?? 0) : 0;
    const opName = opId ? (scores[opId]?.name ?? 'Opponent') : 'Opponent';
    const timerPct = state === 'playing' ? (timeLeft / Math.ceil(q.timeMs / 1000)) * 100 : 0;

    return (
      <div style={{ background: T.bg, minHeight: '100vh', padding: '16px 16px 100px', position: 'relative', overflow: 'hidden' }}>
        {/* Confetti overlay */}
        {showConfetti && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 100 }}>
            {Array.from({length: 40}).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: -20,
                width: Math.random() * 10 + 6,
                height: Math.random() * 10 + 6,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a855f7','#ec4899','#06b6d4'][i % 7],
                animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.3}s`,
              }} />
            ))}
          </div>
        )}

        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Score bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: T.surface, borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar src={userAvatar} name={userName} size={32} border={`2px solid ${T.green}`} />
              <div>
                <div style={{ color: T.textMuted, fontSize: 11 }}>You</div>
                <div style={{ color: T.green, fontSize: 24, fontWeight: 800 }}>{state === 'round-end' ? (scores[myId]?.score ?? 0) : myScore}</div>
              </div>
            </div>
            <div style={{ color: T.textSoft, fontSize: 14 }}>Round {q.round}/{q.total}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: T.textMuted, fontSize: 11 }}>{opName}</div>
                <div style={{ color: T.orange, fontSize: 24, fontWeight: 800 }}>{state === 'round-end' ? (opId ? scores[opId]?.score ?? 0 : 0) : opScore}</div>
              </div>
              <Avatar src={opId ? scores[opId]?.avatar : null} name={opName} size={32} border={`2px solid ${T.orange}`} />
            </div>
          </div>

          {/* Timer bar */}
          {state === 'playing' && (
            <div style={{ height: 6, background: T.border, borderRadius: 3, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3, transition: 'width 1s linear',
                width: `${timerPct}%`,
                background: timerPct > 30 ? T.green : timerPct > 10 ? T.orange : T.red,
              }} />
            </div>
          )}

          {/* Category badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{
              background: q.cat === 'vocabulary' ? 'rgba(59,130,246,0.2)' : q.cat === 'grammar' ? 'rgba(168,85,247,0.2)' : q.cat === 'reading' ? 'rgba(34,197,94,0.2)' : q.cat === 'listening' ? 'rgba(251,146,60,0.2)' : 'rgba(20,184,166,0.2)',
              color: q.cat === 'vocabulary' ? T.blue : q.cat === 'grammar' ? T.purple : q.cat === 'reading' ? T.green : q.cat === 'listening' ? T.orange : T.teal,
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
            }}>
              {q.cat}
            </span>
            {state === 'playing' && (
              <span style={{ color: timeLeft <= 5 ? T.red : T.textMuted, fontSize: 20, fontWeight: 800 }}>{timeLeft}s</span>
            )}
          </div>

          {/* Question */}
              {/* Audio for listening */}
              {q.cat === 'listening' && q.audioPath && (
                <div style={{ marginBottom: 16 }}>
                  <audio controls autoPlay src={q.audioPath} style={{ width: '100%', borderRadius: 8 }} />
                </div>
              )}

              <div style={{ background: T.surface, borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <p style={{ color: T.text, fontSize: 17, lineHeight: 1.6, margin: 0 }}>{q.q}</p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.opts?.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = state === 'round-end' && correctAnswer === i;
                  const isWrong = state === 'round-end' && isSelected && correctAnswer !== i;
                  let bg = T.surface;
                  let border = T.border;
                  if (isCorrect) { bg = 'rgba(34,197,94,0.15)'; border = T.green; }
                  else if (isWrong) { bg = 'rgba(239,68,68,0.15)'; border = T.red; }
                  else if (isSelected && state === 'playing') { bg = 'rgba(59,130,246,0.15)'; border = T.blue; }

                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={answerSent}
                      style={{
                        background: bg, border: `2px solid ${border}`, borderRadius: 12, padding: '14px 16px',
                        color: T.text, fontSize: 15, textAlign: 'left', cursor: answerSent ? 'default' : 'pointer',
                        transition: 'all 0.3s', opacity: answerSent && !isSelected && !isCorrect ? 0.5 : 1,
                        animation: isCorrect ? 'correct-pulse 0.5s ease-out' : isWrong && shakeWrong ? 'shake 0.4s ease-out' : 'none',
                        transform: isCorrect ? 'scale(1.02)' : 'scale(1)',
                      }}>
                      <span style={{ color: T.textMuted, marginRight: 10, fontWeight: 700 }}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                      {isCorrect && ' ✅'}
                      {isWrong && ' ❌'}
                    </button>
                  );
                })}
              </div>

          {answerSent && state === 'playing' && (
            <div style={{ textAlign: 'center', marginTop: 20, color: T.textMuted, fontSize: 14 }}>
              <Loader2 size={16} style={{ display: 'inline', animation: 'spin 1s linear infinite' }} /> Waiting for opponent...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── COUNTDOWN ───
  if (state === 'countdown') {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 8 }}>
            {players.map(p => p.name).join(' vs ')}
          </div>
          <div style={{ fontSize: 96, fontWeight: 900, color: countdown > 0 ? T.gold : T.green }}>
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      </div>
    );
  }

  // ─── WAITING (private room) ───
  if (state === 'waiting' && roomCode) {
    const shareUrl = `https://celpipaicoach.com/battle?join=${roomCode}`;
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: T.surface, borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 420, width: '100%' }}>
          <Users size={48} color={T.blue} />
          <h2 style={{ color: T.text, margin: '16px 0 8px', fontSize: 22 }}>Waiting for opponent...</h2>
          <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24 }}>Share this code with a friend:</p>

          <div style={{ background: T.bg, borderRadius: 12, padding: '16px 20px', fontSize: 32, fontWeight: 900, letterSpacing: 6, color: T.gold, marginBottom: 16 }}>
            {roomCode}
          </div>

          <button onClick={copyCode}
            style={{ background: T.blue, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Invite Link</>}
          </button>

          <div style={{ marginTop: 24 }}>
            <button onClick={reset} style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 20px', color: T.textMuted, fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUEUING ───
  if (state === 'queuing') {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: T.surface, borderRadius: 24, padding: '48px 32px', textAlign: 'center', maxWidth: 420, width: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* Animated radar pulse background */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, height: 300, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${T.blue}`, opacity: 0.15, animation: 'radarPulse 2s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${T.blue}`, opacity: 0.15, animation: 'radarPulse 2s ease-out 0.7s infinite' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${T.blue}`, opacity: 0.15, animation: 'radarPulse 2s ease-out 1.4s infinite' }} />
          </div>

          {/* VS fighters animation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {userAvatar ? (
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  backgroundImage: `url(${userAvatar})`, backgroundSize: "cover", backgroundPosition: "center",
                  boxShadow: "0 0 20px rgba(59,130,246,0.4)",
                  animation: "bounceReady 1.5s ease-in-out infinite",
                  border: "3px solid #3b82f6",
                }} />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, fontWeight: 800, color: "#fff",
                  boxShadow: "0 0 20px rgba(59,130,246,0.4)",
                  animation: "bounceReady 1.5s ease-in-out infinite",
                  border: "3px solid #3b82f6",
                }}>{(userName || "P").charAt(0).toUpperCase()}</div>
              )}
              <span style={{ color: T.blue, fontSize: 12, fontWeight: 700, marginTop: 8 }}>YOU</span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16, color: '#fff',
              boxShadow: '0 0 24px rgba(245,158,11,0.5)',
              animation: 'pulseVs 1.5s ease-in-out infinite',
            }}>VS</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: `linear-gradient(135deg, ${T.border}, ${T.surface})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, border: `2px dashed ${T.textSoft}`,
                animation: 'flickerOpponent 1.2s ease-in-out infinite',
              }}>❓</div>
              <span style={{ color: T.textSoft, fontSize: 12, fontWeight: 700, marginTop: 8, animation: 'dotPulse 1.5s infinite' }}>Searching...</span>
            </div>
          </div>

          <h2 style={{ color: T.text, margin: '0 0 6px', fontSize: 22, fontWeight: 800, position: 'relative', zIndex: 1 }}>Finding opponent</h2>
          <p style={{ color: T.textMuted, fontSize: 13, marginBottom: 28, position: 'relative', zIndex: 1 }}>Hang tight — matching you with a worthy rival</p>

          {/* Animated dots loader */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%', background: T.blue,
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>

          <button onClick={() => { leaveQueue(); }}
            style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 12, padding: '12px 28px', color: T.red, fontSize: 14, fontWeight: 600, cursor: 'pointer', position: 'relative', zIndex: 1, transition: 'all 0.2s' }}>
            ✕ Cancel
          </button>

          <style>{`
            @keyframes radarPulse { 0% { transform: scale(0.3); opacity: 0.3; } 100% { transform: scale(1.2); opacity: 0; } }
            @keyframes bounceReady { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
            @keyframes flickerOpponent { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
            @keyframes dotBounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-12px); } }
            @keyframes dotPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          `}</style>
        </div>
      </div>
    );
  }

  // ─── LOBBY (idle) ───
  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <button onClick={() => router.push('/map')}
          style={{ background: 'transparent', border: 'none', color: T.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* Animated VS icon */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 12, position: 'relative', height: 80 }}>
            <div className="battle-player-left" style={{ animation: 'slideInLeft 0.8s ease-out, bobLeft 2s ease-in-out 0.8s infinite' }}>
              <Avatar src={userAvatar} name={userName} size={48} border="3px solid #3b82f6" />
            </div>
            <div style={{ position: 'relative', zIndex: 2, animation: 'pulseVs 1.5s ease-in-out infinite' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                borderRadius: '50%', width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 18, color: '#fff',
                boxShadow: '0 0 20px rgba(245,158,11,0.5)',
              }}>VS</div>
            </div>
            <div className="battle-player-right" style={{ animation: 'slideInRight 0.8s ease-out, bobRight 2s ease-in-out 0.8s infinite' }}>
              <Avatar src={players.find(p => p.userId !== userId)?.avatar} name={players.find(p => p.userId !== userId)?.name} size={48} border="3px solid #f59e0b" />
            </div>
          </div>
          <style>{`
            @keyframes slideInLeft { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes bobLeft { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-8px); } }
            @keyframes bobRight { 0%,100% { transform: translateX(0); } 50% { transform: translateX(8px); } }
            @keyframes pulseVs { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
            @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
          <h1 style={{ color: T.text, fontSize: 28, fontWeight: 800, margin: '0 0 4px' }}>CELPIP Battle</h1>
          <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>Challenge other students in real-time!</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid ${T.red}`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: T.red, fontSize: 14 }}>
            {error}
          </div>
        )}

        {!connected && (
          <div style={{ background: 'rgba(251,146,60,0.1)', border: `1px solid ${T.orange}`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: T.orange, fontSize: 14, textAlign: 'center' }}>
            <Loader2 size={14} style={{ display: 'inline', animation: 'spin 1s linear infinite', marginRight: 6 }} />
            Connecting to server...
          </div>
        )}

        {/* Quick Match */}
        <button onClick={joinQueue} disabled={!connected}
          style={{
            width: '100%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: 16,
            padding: '24px 20px', cursor: connected ? 'pointer' : 'default', marginBottom: 12,
            opacity: connected ? 1 : 0.5, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16,
          }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
            <span style={{ fontSize: 28 }}>⚔️</span>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Quick Match</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Find a random opponent</div>
          </div>
        </button>

        {/* Create Room */}
        <button onClick={createRoom} disabled={!connected}
          style={{
            width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
            padding: '24px 20px', cursor: connected ? 'pointer' : 'default', marginBottom: 12,
            opacity: connected ? 1 : 0.5, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16,
          }}>
          <div style={{ background: 'rgba(251,146,60,0.15)', borderRadius: 12, padding: 12 }}>
            <Link2 size={28} color={T.orange} />
          </div>
          <div>
            <div style={{ color: T.text, fontSize: 18, fontWeight: 700 }}>Create Room</div>
            <div style={{ color: T.textMuted, fontSize: 13 }}>Invite a friend with a code</div>
          </div>
        </button>

        {/* Join Room */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
          <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Join Room</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text" placeholder="Enter code..." maxLength={6}
              value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              style={{
                flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
                padding: '12px 14px', color: T.text, fontSize: 16, fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', outline: 'none',
              }}
            />
            <button onClick={() => joinRoom(joinCode)} disabled={!connected || joinCode.length < 6}
              style={{
                background: T.green, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px',
                fontSize: 15, fontWeight: 700, cursor: connected && joinCode.length >= 6 ? 'pointer' : 'default',
                opacity: connected && joinCode.length >= 6 ? 1 : 0.5,
              }}>
              Join
            </button>
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: T.surface, borderRadius: 16, padding: 20, marginTop: 24 }}>
          <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>How it works</div>
          {[
            { icon: '🎯', text: '6 questions: 2x Vocabulary, 2x Grammar & 2x Reading' },
            { icon: '⏱️', text: '30 seconds per question' },
            { icon: '⚡', text: 'Faster correct answers = more points' },
            { icon: '🏆', text: 'Win to climb the Battle Rankings!' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', color: T.textMuted, fontSize: 14 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}

          {/* Scoring breakdown */}
          <div style={{ marginTop: 16, padding: 16, background: T.bg, borderRadius: 12 }}>
            <div style={{ color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📊 Scoring</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: T.textMuted }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✅ Correct in 0–10s</span>
                <span style={{ color: T.green, fontWeight: 700 }}>10 pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>✅ Correct in 11–30s</span>
                <span style={{ color: T.green, fontWeight: 700 }}>5 pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>❌ Wrong or no answer</span>
                <span style={{ color: T.red, fontWeight: 700 }}>0 pts</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
                Answer fast for max points! Max score: 60 pts per battle.
              </div>
            </div>

            {/* Leagues */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
              <div style={{ color: T.text, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🏆 Leagues</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                {[
                  { name: 'Bronze', emoji: '🥉', pts: 0 },
                  { name: 'Silver', emoji: '🥈', pts: 100 },
                  { name: 'Gold', emoji: '🥇', pts: 200 },
                  { name: 'Platinum', emoji: '⚡', pts: 300 },
                  { name: 'Diamond', emoji: '💎', pts: 400 },
                  { name: 'Master', emoji: '🏅', pts: 500 },
                  { name: 'Grand Master', emoji: '🔮', pts: 700 },
                  { name: 'Challenger', emoji: '👑', pts: 1000 },
                ].map(l => (
                  <div key={l.name} style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 6,
                    background: T.bg, color: T.textMuted, whiteSpace: 'nowrap' as const,
                  }}>
                    {l.emoji} {l.name} ({l.pts}+)
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Rankings */}
        <div style={{ background: T.surface, borderRadius: 20, padding: '24px 16px', marginTop: 24, overflow: 'hidden', position: 'relative' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>⚔️</span>
              <span style={{ color: T.text, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>Battle Rankings</span>
            </div>
          </div>

          {lbLoading ? (
            <div style={{ textAlign: 'center', padding: 32, color: T.textMuted }}>
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13 }}>Loading rankings...</div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏟️</div>
              <div style={{ color: T.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>No battles yet</div>
              <div style={{ color: T.textMuted, fontSize: 13 }}>Play a match to claim the #1 spot!</div>
            </div>
          ) : (
            <>
              {/* Podium — top 3 */}
              {leaderboard.length >= 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 20, padding: '0 8px' }}>
                  {[1, 0, 2].map(rank => {
                    const p = leaderboard[rank];
                    if (!p) return <div key={rank} style={{ flex: 1 }} />;
                    const isMe = p.user_id === userId;
                    const isFirst = rank === 0;
                    const heights = [120, 140, 100];
                    const colors = ['linear-gradient(180deg, #94a3b8 0%, #64748b 100%)', 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)', 'linear-gradient(180deg, #d97706 0%, #92400e 100%)'];
                    const medals = ['🥈', '🥇', '🥉'];
                    const glows = ['rgba(148,163,184,0.3)', 'rgba(251,191,36,0.4)', 'rgba(217,119,6,0.3)'];
                    const displayRank = [1, 0, 2][rank === 0 ? 1 : rank === 1 ? 0 : 2];
                    const name = (p.name || 'Player').split(' ')[0];
                    const winRate = p.battles_played > 0 ? Math.round((p.wins / p.battles_played) * 100) : 0;
                    return (
                      <div key={rank} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Medal */}
                        <div style={{ fontSize: isFirst ? 28 : 22, marginBottom: 6 }}>{medals[[1,0,2].indexOf(rank)]}</div>
                        {/* Avatar circle */}
                        {p.avatar ? (
                          <div style={{
                            width: isFirst ? 56 : 44, height: isFirst ? 56 : 44, borderRadius: '50%',
                            backgroundImage: `url(${p.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center',
                            boxShadow: `0 0 20px ${glows[[1,0,2].indexOf(rank)]}`,
                            border: isMe ? '3px solid #a78bfa' : `3px solid ${['#94a3b8','#fbbf24','#d97706'][[1,0,2].indexOf(rank)]}`,
                            marginBottom: 6,
                          }} />
                        ) : (
                          <div style={{
                            width: isFirst ? 56 : 44, height: isFirst ? 56 : 44, borderRadius: '50%',
                            background: colors[[1,0,2].indexOf(rank)],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: isFirst ? 24 : 18, fontWeight: 800, color: '#fff',
                            boxShadow: `0 0 20px ${glows[[1,0,2].indexOf(rank)]}`,
                            border: isMe ? '3px solid #a78bfa' : '2px solid transparent',
                            marginBottom: 6,
                          }}>
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {/* Name */}
                        <div style={{
                          color: isMe ? '#a78bfa' : T.text, fontSize: 12, fontWeight: 700,
                          maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, textAlign: 'center',
                        }}>
                          {name}
                        </div>
                        {/* Rating */}
                        <div style={{ color: T.textMuted, fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                          {getLeague(Number(p.rating)).emoji} {Number(p.rating)} pts
                        </div>
                        {/* Win rate */}
                        <div style={{ color: getLeague(Number(p.rating)).color, fontSize: 10, marginTop: 1, fontWeight: 700 }}>
                          {getLeague(Number(p.rating)).emoji} {getLeague(Number(p.rating)).name}
                        </div>
                        {/* Pedestal */}
                        <div style={{
                          width: '100%', height: heights[[1,0,2].indexOf(rank)] * 0.5,
                          background: colors[[1,0,2].indexOf(rank)], borderRadius: '8px 8px 0 0',
                          marginTop: 8, opacity: 0.25,
                        }} />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* List — rank 4+ */}
              {leaderboard.length > 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {leaderboard.slice(3, 10).map((p: any, i: number) => {
                    const isMe = p.user_id === userId;
                    const winRate = p.battles_played > 0 ? Math.round((p.wins / p.battles_played) * 100) : 0;
                    return (
                      <div key={p.user_id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px', borderRadius: 12, minHeight: 52,
                        background: isMe ? 'rgba(139,92,246,0.1)' : 'transparent',
                        border: isMe ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent',
                      }}>
                        <span style={{ width: 28, textAlign: 'center', color: T.textMuted, fontSize: 14, fontWeight: 700 }}>#{i + 4}</span>
                        <Avatar src={p.avatar} name={p.name} size={36} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: isMe ? '#a78bfa' : T.text, fontSize: 14, fontWeight: 600,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                          }}>
                            {p.name} {isMe && <span style={{ fontSize: 10, opacity: 0.7 }}>(you)</span>}
                          </div>
                          <div style={{ color: T.textMuted, fontSize: 11 }}>
                            {p.wins}W {p.losses}L · {winRate}%
                          </div>
                        </div>
                        <div style={{
                          background: getLeague(Number(p.rating)).bg, borderRadius: 8, padding: '5px 10px',
                          color: '#fff', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' as const,
                        }}>
                          {getLeague(Number(p.rating)).emoji} {Number(p.rating)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Your position if not in top 10 */}
              {userId && !leaderboard.slice(0, 10).find((p: any) => p.user_id === userId) && leaderboard.find((p: any) => p.user_id === userId) && (() => {
                const p = leaderboard.find((pp: any) => pp.user_id === userId)!;
                const rank = leaderboard.indexOf(p) + 1;
                const winRate = p.battles_played > 0 ? Math.round((p.wins / p.battles_played) * 100) : 0;
                return (
                  <div style={{ marginTop: 8, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px', borderRadius: 12,
                      background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                    }}>
                      <span style={{ width: 28, textAlign: 'center', color: '#a78bfa', fontSize: 14, fontWeight: 700 }}>#{rank}</span>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: 'rgba(139,92,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 15, fontWeight: 700, color: '#a78bfa', flexShrink: 0,
                      }}>
                        {(p.name || 'P').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#a78bfa', fontSize: 14, fontWeight: 600 }}>
                          {p.name} <span style={{ fontSize: 10, opacity: 0.7 }}>(you)</span>
                        </div>
                        <div style={{ color: T.textMuted, fontSize: 11 }}>{p.wins}W {p.losses}L · {winRate}%</div>
                      </div>
                      <div style={{
                        background: getLeague(Number(p.rating)).bg, borderRadius: 8, padding: '5px 10px',
                        color: '#fff', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' as const,
                      }}>
                        {getLeague(Number(p.rating)).emoji} {Number(p.rating)}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0.3); opacity: 0; }
        }
        @keyframes score-popup {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes correct-pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </div>
  );
}
