import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from './ErrorState.module.css';

export default function ErrorState() {
  const { setHasSimulatedError } = useRewards();

  return (
    <div className={styles.errorSection} role="alert">
      <div className={styles.errorCard}>
        <div className={styles.iconCircle}>
          <AlertCircle size={32} />
        </div>

        <h3 className={styles.errorTitle}>
          Unable to Synchronize Rewards Ledger
        </h3>

        <p className={styles.errorText}>
          We encountered a temporary network delay when confirming your latest level progression and task state. Your local achievements are preserved safely.
        </p>

        <button
          className={styles.retryBtn}
          onClick={() => setHasSimulatedError(false)}
        >
          <RotateCcw size={16} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
