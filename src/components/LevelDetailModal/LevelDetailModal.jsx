import React from 'react';
import { X, Check, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from './LevelDetailModal.module.css';

export default function LevelDetailModal() {
  const {
    selectedLevelForModal,
    closeLevelModal,
    currentLevel
  } = useRewards();

  if (!selectedLevelForModal) return null;

  const lvl = selectedLevelForModal;
  const isCompleted = lvl.level < currentLevel.level;
  const isCurrent = lvl.level === currentLevel.level;
  const isLocked = lvl.level > currentLevel.level;

  return (
    <div
      className={styles.modalBackdrop}
      onClick={closeLevelModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-level-title"
    >
      <div
        className={styles.modalBox}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={closeLevelModal}
          aria-label="Close tier details modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.badgeShield}>
            <Award size={28} />
          </div>

          <div className={styles.headerInfo}>
            <span className={styles.levelTag}>
              Tier {lvl.level} • {lvl.tier} Class
            </span>
            <h2 id="modal-level-title" className={styles.levelTitle}>
              {lvl.name}
            </h2>

            <div>
              {isCompleted && (
                <span className={`${styles.statusPill} badge-green`}>
                  <CheckCircle2 size={12} /> Completed Tier
                </span>
              )}
              {isCurrent && (
                <span className={`${styles.statusPill} badge-gold`}>
                  <Sparkles size={12} /> Your Current Tier
                </span>
              )}
              {isLocked && (
                <span className={`${styles.statusPill} badge-silver`}>
                  <Lock size={12} /> Locked ({lvl.minXp.toLocaleString()} XP Required)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Milestone Reward Box */}
        <div className={styles.rewardCardInside}>
          <div className={styles.rewardCardTitle}>
            Milestone Achievement Reward
          </div>
          <p className={styles.rewardCardValue}>
            {lvl.rewardTitle}
          </p>
        </div>

        {/* Unlocked Perks List */}
        <div className={styles.perksHeading}>
          Member Privileges & Perks
        </div>
        <div className={styles.perksList}>
          {lvl.perks.map((perk, i) => (
            <div key={i} className={styles.perkItem}>
              <Check size={16} className={styles.perkCheck} strokeWidth={2.5} />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footerActions}>
          <button className={styles.dismissBtn} onClick={closeLevelModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
