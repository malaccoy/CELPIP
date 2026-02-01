'use client';

import DailyChallengeWidget from '@/components/DailyChallenge';
import styles from '@/styles/Pages.module.scss';

export default function ChallengePage() {
  return (
    <div className={styles.pageContainer}>
      <DailyChallengeWidget mode="full" />
    </div>
  );
}
