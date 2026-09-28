import React from 'react';
import {
  Gamepad2,
  Coins,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  Gift,
  ArrowUpRight
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import heroBgImg from '../../assets/hero-banner-bg.jpg';
import crest3dImg from '../../assets/tier-crest-3d.jpg';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const {
    currentLevel,
    nextLevel,
    progressPercent,
    currentXp,
    veCoinsBalance,
    gamePointsBalance,
    streakData,
    claimTodayStreak,
    openLevelModal
  } = useRewards();

  const tierMultiplier = (1 + (currentLevel.level - 1) * 0.05).toFixed(2);
  const potentialCoins = Math.floor(gamePointsBalance * 0.1);
  const potentialXp = Math.floor(gamePointsBalance * 0.25);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.bannerWrapper} aria-label="VELOOP Rewards Hero Showcase">
      <div className="container">
        <div className={styles.bannerContainer}>
          {/* Background Artwork Image & Overlays */}
          <div className={styles.bgImageLayer}>
            <img
              src={heroBgImg}
              alt="VELOOP 3D Gaming & Rewards Ecosystem"
              className={styles.bgImage}
            />
            <div className={styles.gradientOverlay} />
            <div className={styles.radialGlowTop} />
            <div className={styles.gridPatternOverlay} />
          </div>

          {/* Banner Main Grid */}
          <div className={styles.bannerContentGrid}>
            {/* Left Column: Headlines & Call-to-Actions */}
            <div className={styles.leftCol}>
              {/* Event & Tier Pill Row */}
              <div className={styles.eventPillRow}>
                <div className={styles.liveSeasonBadge}>
                  <span className={styles.pulseDot} />
                  <span className={styles.badgeText}>SEASON 2: APEX ASCENSION</span>
                </div>
                <div className={styles.tierBoostBadge}>
                  <Zap size={13} className={styles.zapIcon} />
                  <span>{tierMultiplier}x Earning Boost Active</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className={styles.bannerTitle}>
                LEVEL UP YOUR PRESTIGE.
                <span className={styles.highlightText}> UNLOCK ELITE REWARDS.</span>
              </h1>

              {/* Description */}
              <p className={styles.bannerSubtitle}>
                Master <strong>5 skill-based arcade games</strong>, convert your game points into spendable{' '}
                <strong className={styles.goldText}>VE Coins</strong> and <strong className={styles.cyanText}>Level XP</strong>, and climb <strong>10 exclusive tiers</strong> from Bronze to Obsidian.
              </p>

              {/* Action Buttons */}
              <div className={styles.actionButtonGroup}>
                <button
                  onClick={() => scrollToSection('arcade-games')}
                  className={styles.primaryPlayBtn}
                >
                  <Gamepad2 size={18} />
                  <span>Play Arcade Games</span>
                  <ArrowRight size={16} className={styles.btnArrow} />
                </button>

                <button
                  onClick={() => scrollToSection('points-converter')}
                  className={styles.secondaryConvertBtn}
                  title={`Convert ${gamePointsBalance} arcade points to +${potentialCoins} VE Coins & +${potentialXp} XP`}
                >
                  <Coins size={18} />
                  <span>
                    Convert Points (+{potentialCoins} VE)
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection('roadmap')}
                  className={styles.tertiaryLinkBtn}
                >
                  <span>10-Tier Roadmap</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>

              {/* Micro-Features Row */}
              <div className={styles.featuresRow}>
                <div className={styles.featureItem}>
                  <ShieldCheck size={16} className={styles.featureIconGreen} />
                  <span>100% Skill-Based Games</span>
                </div>
                <div className={styles.featureDivider} />
                <div className={styles.featureItem}>
                  <Zap size={16} className={styles.featureIconGold} />
                  <span>Sub-Minute VIP Settlements</span>
                </div>
                <div className={styles.featureDivider} />
                <div className={styles.featureItem}>
                  <Gift size={16} className={styles.featureIconBlue} />
                  <span>Up to 2.0x Lifetime Multiplier</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Tier Status Cockpit Card */}
            <div className={styles.rightCol}>
              <div className={styles.cockpitCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.crestMiniWrapper}>
                    <img
                      src={crest3dImg}
                      alt={`Level ${currentLevel.level} Crest`}
                      className={styles.crestMiniImg}
                    />
                  </div>
                  <div className={styles.cardHeaderInfo}>
                    <span className={styles.memberStatusTag}>
                      {currentLevel.tier} Member
                    </span>
                    <h3 className={styles.cardLevelTitle}>
                      Level {currentLevel.level}: {currentLevel.name}
                    </h3>
                  </div>
                </div>

                {/* Progress Meter Inside Banner Cockpit */}
                <div className={styles.cardProgressBlock}>
                  <div className={styles.cardProgressLabels}>
                    <span>XP Milestone</span>
                    <strong>{progressPercent}%</strong>
                  </div>
                  <div className={styles.cardProgressBar}>
                    <div
                      className={styles.cardProgressFill}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className={styles.cardProgressFooter}>
                    <span>{currentXp.toLocaleString()} XP</span>
                    <span className={styles.nextTargetTag}>
                      Next: {nextLevel ? nextLevel.name : 'Apex Max'}
                    </span>
                  </div>
                </div>

                {/* Live Vault Balance Pills */}
                <div className={styles.vaultPillGrid}>
                  <div className={styles.vaultPill}>
                    <span className={styles.vaultLabel}>
                      <Coins size={12} color="#fbbf24" /> VE Coins Wallet
                    </span>
                    <span className={styles.vaultValueGold}>
                      {veCoinsBalance.toLocaleString()} VE
                    </span>
                  </div>

                  <div className={styles.vaultPill}>
                    <span className={styles.vaultLabel}>
                      <Zap size={12} color="#38bdf8" /> Arcade Points
                    </span>
                    <span className={styles.vaultValueBlue}>
                      {gamePointsBalance.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* Quick Interactive Streak Check-in */}
                <div className={styles.quickStreakSection}>
                  <div className={styles.streakInfo}>
                    <Flame size={15} color="#f97316" />
                    <span>
                      Day {streakData.currentStreak} Streak: <strong>+{streakData.todayRewardXp} XP</strong>
                    </span>
                  </div>
                  {streakData.canClaimToday ? (
                    <button
                      onClick={claimTodayStreak}
                      className={styles.claimStreakBtn}
                    >
                      Claim Now
                    </button>
                  ) : (
                    <span className={styles.claimedBadge}>
                      <CheckCircle2 size={13} /> Claimed Today
                    </span>
                  )}
                </div>

                {/* Inspect Perks Action */}
                <button
                  onClick={() => openLevelModal(currentLevel)}
                  className={styles.inspectTierBtn}
                >
                  <span>Inspect Level {currentLevel.level} Privileges</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
