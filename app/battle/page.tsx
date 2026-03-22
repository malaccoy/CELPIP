'use client';
import dynamic from 'next/dynamic';

const BattleLobby = dynamic(() => import('@/components/BattleLobby'), { ssr: false });
export default function BattlePage() { return <BattleLobby />; }
