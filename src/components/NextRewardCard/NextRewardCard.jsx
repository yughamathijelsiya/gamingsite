import React from 'react';
import {
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  Gift,
  HelpCircle
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import Tooltip from '../Tooltip/Tooltip';
import rewardCardImg from '../../assets/reward-card.jpg';
import styles from './NextRewardCard.module.css';

export default function NextRewardCard() {
  const {
    currentLevel,
    nextLevel,
    progressPercent,
    remainingXp,
    openLevelModal
  } = useRewards();

  if (!nextLevel) return null;

  return (
    <section id="next-reward" className={styles.rewardSection} aria-label="Next-Level Reward Showcase">
      <div className="container">
        <div className={styles.rewardCard}>
          <div className={styles.cardGlowEffect} aria-hidden="true" />

          {/* Header Row */}
          <div className={styles.headerRow}>
            <div className={styles.statusPill}>
              <Lock size={14} />
              <span>Locked • Unlocks at Level {nextLevel.level}</span>
            </div>

            <div className={styles.demoDisclaimer}>
              Demo Reward Value • Simulation Only
            </div>
          </div>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            {/* Left Info Column */}
            <div className={styles.infoColumn}>
              <div className={styles.tagline}>
                <Sparkles size={14} color="#f59e0b" />
                <span>Next Milestone Unlock</span>
              </div>

              <h2 className={styles.rewardTitle}>
                {nextLevel.rewardTitle}
              </h2>

              <p className={styles.rewardDescription}>
                Elevate your status from <strong>{currentLevel.name}</strong> to <strong>{nextLevel.name}</strong>. Reaching Level {nextLevel.level} unlocks an instantaneous $25 credit voucher, an upgraded 1.25x earning boost across all activities, and expedited sub-minute withdrawals.
              </p>

              {/* Highlighted Perks List */}
              <div className={styles.perksList}>
                {nextLevel.perks.slice(0, 4).map((perk, index) => (
                  <div key={index} className={styles.perkItem}>
                    <Check size={14} className={styles.perkIcon} strokeWidth={2.5} />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Progress to unlock bar */}
              <div className={styles.unlockProgressWrapper}>
                <div className={styles.unlockProgressHeader}>
                  <span className={styles.unlockLabel}>
                    <Lock size={13} color="#94a3b8" />
                    <span>Unlock Requirement: {nextLevel.minXp.toLocaleString()} XP</span>
                    <Tooltip text="Earn XP via VE Coin Catch, Daily Login Streaks, and Educational modules to reach this tier.">
                      <HelpCircle size={13} color="#94a3b8" style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </span>
                  <span className={styles.unlockStatus}>
                    {remainingXp.toLocaleString()} XP to unlock
                  </span>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.ctaRow}>
                <a href="#play-earn" className={styles.actionBtn}>
                  <span>Earn XP in VE Coin Catch</span>
                  <ArrowRight size={14} />
                </a>

                <button
                  className={styles.secondaryBtn}
                  onClick={() => openLevelModal(nextLevel)}
                >
                  <Gift size={14} />
                  <span>Inspect Tier Perks</span>
                </button>
              </div>
            </div>

            {/* Right Visual Card Column */}
            <div className={styles.visualColumn}>
              <div className={styles.cardContainer}>
                <img
                  src={rewardCardImg}
                  alt={`Level ${nextLevel.level} Reward Card Preview`}
                  className={styles.cardImage}
                />
                <div className={styles.lockOverlay}>
                  <Lock size={12} />
                  <span>Requires Lvl {nextLevel.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
