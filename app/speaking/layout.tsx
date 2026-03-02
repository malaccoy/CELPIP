import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Speaking Practice — Free Recording, Self-Eval & AI Coach',
  description: 'Practice all 8 CELPIP Speaking tasks with recording, timer & self-evaluation. Free technique guide with CSF method. AI Speaking Coach with Whisper for Pro users.',
  alternates: { canonical: 'https://celpipaicoach.com/speaking' },
};

export default function SpeakingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
