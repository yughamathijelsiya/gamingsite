import React from 'react';
import {
  Wrench,
  X,
  PlusCircle,
  Zap,
  RotateCcw,
  Eye,
  AlertTriangle,
  PlaySquare
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from './DemoToolbar.module.css';

export default function DemoToolbar({ isOpen, onClose }) {
  const {
    addXp,
    simulateLevelUp,
    resetDemoData,
    isLoadingSkeleton,
    setIsLoadingSkeleton,
    hasSimulatedError,
    setHasSimulatedError,
    resetGamePlays
  } = useRewards();

  if (!isOpen) return null;

  return (
    <aside className={styles.toolbar} aria-label="Demo Testing Panel">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Wrench size={14} />
            <span>Developer & Reviewer Demo Controls</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close demo tools"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.actionBtn} ${styles.primaryAction}`}
            onClick={() => addXp(250, 'Demo Simulation +250 XP', 'Demo')}
          >
            <PlusCircle size={13} />
            <span>+250 XP</span>
          </button>

          <button
            className={`${styles.actionBtn} ${styles.primaryAction}`}
            onClick={() => addXp(750, 'Demo Simulation +750 XP', 'Demo')}
          >
            <PlusCircle size={13} />
            <span>+750 XP</span>
          </button>

          <button
            className={`${styles.actionBtn} ${styles.primaryAction}`}
            onClick={simulateLevelUp}
            title="Automatically reach the threshold to trigger Level-Up modal"
          >
            <Zap size={13} />
            <span>Trigger Level-Up</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={() => setIsLoadingSkeleton(!isLoadingSkeleton)}
          >
            <Eye size={13} />
            <span>{isLoadingSkeleton ? 'Hide Skeletons' : 'Test Skeletons'}</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={() => setHasSimulatedError(!hasSimulatedError)}
          >
            <AlertTriangle size={13} />
            <span>{hasSimulatedError ? 'Clear Error' : 'Test Error State'}</span>
          </button>

          <button
            className={styles.actionBtn}
            onClick={resetGamePlays}
            title="Restore 3 mini-game plays"
          >
            <PlaySquare size={13} />
            <span>Reset Game Energy</span>
          </button>

          <button
            className={`${styles.actionBtn} ${styles.dangerAction}`}
            onClick={resetDemoData}
            title="Reset XP and activities to default state"
          >
            <RotateCcw size={13} />
            <span>Reset State</span>
          </button>
        </div>

        <div className={styles.stateTag}>
          Simulates backend XP sync, level-up milestones, loading states, and error recovery.
        </div>
      </div>
    </aside>
  );
}
