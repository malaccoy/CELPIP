'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type BattleState = 'idle' | 'queuing' | 'waiting' | 'countdown' | 'playing' | 'round-end' | 'finished';

interface Player { userId: string; name: string; avatar?: string | null; }
interface Scores { [userId: string]: { name: string; score: number; avatar?: string | null; isWinner?: boolean } }
interface Question {
  id: string; cat: string; type: string; q?: string; prompt?: string;
  opts?: string[]; audioPath?: string; round: number; total: number; timeMs: number;
}

export function useBattleSocket(userId: string | null, userName: string | null, userAvatar?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<BattleState>('idle');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [scores, setScores] = useState<Scores>({});
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const socket = io(window.location.origin, { path: '/socket.io/', transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('auth', { userId, userName, avatar: userAvatar });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('auth:ok', () => {});
    socket.on('error', (data) => setError(data.msg));

    socket.on('queue:joined', () => setState('queuing'));
    socket.on('queue:left', () => setState('idle'));

    socket.on('room:created', (data) => {
      setRoomCode(data.code);
      setState('waiting');
    });

    socket.on('room:ready', (data) => {
      setRoomCode(data.code);
      setPlayers(data.players);
      setState('countdown');
      setCountdown(3);
    });

    socket.on('round:start', (data) => {
      setQuestion(data);
      setCorrectAnswer(null);
      setState('playing');
    });

    socket.on('round:end', (data) => {
      setScores(data.scores);
      setCorrectAnswer(data.correctAnswer);
      setState('round-end');
    });

    socket.on('battle:end', (data) => {
      setScores(data.scores);
      setFinalResult(data);
      setState('finished');
    });

    socket.on('battle:forfeit', (data) => {
      setFinalResult({ forfeit: true, forfeitedBy: data.forfeitedBy });
      setState('finished');
    });

    return () => { socket.disconnect(); };
  }, [userId, userName]);

  // Countdown timer
  useEffect(() => {
    if (state !== 'countdown' || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [state, countdown]);

  const joinQueue = useCallback(() => socketRef.current?.emit('queue:join'), []);
  const leaveQueue = useCallback(() => socketRef.current?.emit('queue:leave'), []);
  const createRoom = useCallback(() => socketRef.current?.emit('room:create'), []);
  const joinRoom = useCallback((code: string) => socketRef.current?.emit('room:join', { code }), []);
  const sendAnswer = useCallback((answer: number | null, timeMs: number, accuracy?: number) => {
    socketRef.current?.emit('answer', { answer, timeMs, accuracy });
  }, []);
  const reset = useCallback(() => {
    setState('idle'); setRoomCode(null); setPlayers([]); setQuestion(null);
    setScores({}); setCorrectAnswer(null); setFinalResult(null); setError(null);
  }, []);

  return {
    connected, state, roomCode, players, question, scores, correctAnswer,
    finalResult, error, countdown,
    joinQueue, leaveQueue, createRoom, joinRoom, sendAnswer, reset
  };
}
