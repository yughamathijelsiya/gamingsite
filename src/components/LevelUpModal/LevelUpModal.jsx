import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import crestImg from '../../assets/level-crest.jpg';
import styles from './LevelUpModal.module.css';

export default function LevelUpModal() {
  const {
    isLevelUpModalOpen,
    levelUpDetails,
    closeLevelUpModal,
    currentLevel
  } = useRewards();

  useEffect(() => {
    if (isLevelUpModalOpen) {
      // Restrained, premium confetti burst with fintech gold/silver/soft-blue tones
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#cbd5e1', '#818cf8'],
        disableForReducedMotion: true
      });
    }
  }, [isLevelUpModalOpen]);

  if (!isLevelUpModalOpen) return null;

  const targetLevel = levelUpDetails?.newLevel || currentLevel;
  const rewardName = levelUpDetails?.reward || targetLevel.rewardTitle;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={closeLevelUpModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="levelup-title"
    >
      <div
        className={styles.celebrationCard}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.ambientGlow} aria-hidden="true" />

        <div className={styles.crestWrapper}>
          <img
            src={crestImg}
            alt={`Level ${targetLevel.level} Insignia`}
            className={styles.crestImg}
          />
        </div>

        <div>
          <span className={styles.congratsTag}>
            Prestige Tier Milestone Achieved
          </span>
          <h2 id="levelup-title" className={styles.newLevelTitle}>
            LEVEL {targetLevel.level} UNLOCKED
          </h2>
          <div className={styles.newLevelTier}>
            {targetLevel.name}
          </div>
        </div>

        {/* Reward Box */}
        <div className={styles.rewardRevealBox}>
          <span className={styles.rewardLabel}>
            Unlocked Tier Reward Package
          </span>
          <p className={styles.rewardTitle}>
            {rewardName}
          </p>
        </div>

        <button
          className={styles.continueBtn}
          onClick={closeLevelUpModal}
        >
          <span>Claim Reward & Continue</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
